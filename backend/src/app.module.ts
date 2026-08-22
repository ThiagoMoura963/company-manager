import { Module } from '@nestjs/common';

import { CompaniesModule } from './companies/companies.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';

@Module({
  imports: [
    CompaniesModule,
    DatabaseModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env.development',
      expandVariables: true,
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
