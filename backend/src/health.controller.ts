import { Controller, Get, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_CONNECTION } from './database/database.constants';

@Controller('/api/v1/health')
export class HealthController {
  constructor(@Inject(DATABASE_CONNECTION) private readonly database: Pool) {}

  @Get()
  async check() {
    await this.database.query('SELECT 1 + 1;');

    return {
      status: 'ok',
    };
  }
}
