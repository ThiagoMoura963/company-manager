import { execSync } from 'node:child_process';

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

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  closeDatabase,
};

export default orchestrator;
