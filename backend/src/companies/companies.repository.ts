import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_CONNECTION } from 'src/database/database.constants';

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

@Injectable()
export class CompaniesRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly database: Pool) {}

  async create(companyInputValues: CreateCompanyInput) {
    const results = await this.database.query<Company>({
      text: `
          INSERT INTO 
            companies (name, cnpj, trade_name, address)
          VALUES
            ($1, $2, $3, $4)
          RETURNING
            *
          ;`,
      values: [
        companyInputValues.name,
        companyInputValues.cnpj,
        companyInputValues.trade_name,
        companyInputValues.address,
      ],
    });

    return results.rows[0];
  }
}
