import { execSync } from 'node:child_process';

import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import retry from 'async-retry';
import { Pool } from 'pg';
import { AppModule } from 'src/app.module';
import { EmailService } from 'src/email/email.service';

const databaseUrl = process.env.DATABASE_URL;

let app: TestingModule;

if (!databaseUrl) {
  throw new Error('Banco de Dados não configurado.');
}

const database = new Pool({
  connectionString: databaseUrl,
});

type CreateCompanyInput = {
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
};

type Company = {
  id: string;
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
  created_at: Date;
  updated_at: Date;
};

const emailHttpUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function waitForAllServices() {
  await waitForWebService();
  await waitForEmailService();
  await initializeApp();

  async function waitForWebService() {
    return retry(fetchHealthPage, {
      retries: 100,
      maxTimeout: 10_000,
    });

    async function fetchHealthPage() {
      const response = await fetch('http://localhost:3000/api/v1/health');

      if (response.status !== 200) {
        throw Error();
      }
    }
  }

  async function waitForEmailService() {
    return retry(fetchEmailService, {});

    async function fetchEmailService() {
      const response = await fetch(emailHttpUrl);

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function initializeApp() {
  app = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
}

function getEmailService() {
  return app.get(EmailService);
}

async function clearDatabase() {
  await database.query({
    text: 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;',
  });
}

async function closeDatabase() {
  await database.end();
}

function runPendingMigrations(): void {
  execSync('npm run migrations:up', {
    stdio: 'inherit',
  });
}

async function createCompany(
  companyObject: Partial<CreateCompanyInput> = {},
): Promise<Company> {
  const company: CreateCompanyInput = {
    name: companyObject?.name || faker.company.name(),
    cnpj: companyObject?.cnpj ?? faker.string.numeric(14),
    trade_name: companyObject?.trade_name ?? faker.company.name(),
    address:
      companyObject?.address ||
      `${faker.location.streetAddress()}, ${faker.location.city()} - ${faker.location.state(
        {
          abbreviated: true,
        },
      )}`,
  };

  const results = await database.query<Company>({
    text: `
      INSERT INTO
        companies (name, cnpj, trade_name, address)
      VALUES 
        ($1, $2, $3, $4)
      RETURNING
        *
      ;`,
    values: [company.name, company.cnpj, company.trade_name, company.address],
  });

  return results.rows[0];
}

async function deleteAllEmails() {
  await fetch(`${emailHttpUrl}/messages`, {
    method: 'DELETE',
  });
}

async function getLastEmail() {
  const emailListResponse = await fetch(`${emailHttpUrl}/messages`);
  const emailListBody = await emailListResponse.json();
  const lastEmailItem = emailListBody.pop();

  if (!lastEmailItem) return null;

  const emailTextResponse = await fetch(
    `${emailHttpUrl}/messages/${lastEmailItem.id}.plain`,
  );
  const emailTextBody = await emailTextResponse.text();

  lastEmailItem.text = emailTextBody;
  return lastEmailItem;
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  closeDatabase,
  runPendingMigrations,
  createCompany,
  getLastEmail,
  deleteAllEmails,
  getEmailService,
};

export default orchestrator;
