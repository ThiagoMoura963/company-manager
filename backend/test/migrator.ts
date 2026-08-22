import { runner } from 'node-pg-migrate';
import { resolve } from 'node:path';

async function runPendingMigrations(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('Banco de dados não configurado.');
  }

  await runner({
    dryRun: false,
    dir: resolve('infra', 'migrations'),
    direction: 'up',
    log: () => {},
    migrationsTable: 'pgmigrations',
    databaseUrl,
  });
}

const migrator = {
  runPendingMigrations,
};

export default migrator;
