import { Pool } from 'pg';
import { DATABASE_CONNECTION } from 'src/database/database.constants';

const databaseUrl = DATABASE_CONNECTION;

if (!databaseUrl) {
  throw new Error('Banco de dados não configurado.');
}

const database = new Pool({
  connectionString: databaseUrl,
});

export default database;
