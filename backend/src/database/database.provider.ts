import { Provider } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database.constants';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { ServiceError } from 'src/errors/errors';

export const databaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const databaseUrl = configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new ServiceError({
        message: 'Banco de dados não configurado.',
        action: 'Verifique a configuração da variável DATABASE_URL.',
      });
    }

    const pool = new Pool({
      connectionString: databaseUrl,
    });

    return pool;
  },
};
