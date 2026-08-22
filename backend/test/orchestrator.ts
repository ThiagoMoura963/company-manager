import { execSync } from 'node:child_process';

import { faker } from '@faker-js/faker';
import retry from 'async-retry';
import { Pool } from 'pg';
import migrator from './migrator';

const databaseUrl = process.env.DATABASE_URL;

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

async function waitForAllServices() {
  await waitForWebService();

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

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  closeDatabase,
  runPendingMigrations,
  createCompany,
};

export default orchestrator;
