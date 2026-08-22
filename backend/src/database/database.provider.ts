import { Provider } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database.constants';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const databaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const databaseUrl = configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error('Banco de dados não configurado.');
    }

    const pool = new Pool({
      connectionString: databaseUrl,
    });

    return pool;
  },
};
