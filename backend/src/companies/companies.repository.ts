import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { NotFoundError, ValidationError } from 'src/errors/errors';
import { DATABASE_CONNECTION } from 'src/database/database.constants';

type CreateCompanyInput = {
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
};

type UpdateCompanyInput = {
  name?: string;
  cnpj?: string;
  trade_name?: string;
  address?: string;
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

  async findOneById(id: string) {
    const results = await this.database.query<Company>({
      text: `
        SELECT
          *
        FROM
          companies
        WHERE
          id = $1
        LIMIT 
          1
        ;`,
      values: [id],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: 'O id enviado não existe dentro do sistema.',
        action: 'Verifique se o id está digitado corretamente',
      });
    }

    return results.rows[0];
  }

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

  async update(id: string, companyInputValues: UpdateCompanyInput) {
    const results = await this.database.query<Company>({
      text: `
        UPDATE  
          companies
        SET
          name = $2,
          cnpj = $3,
          trade_name = $4,
          address = $5,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING 
          *
        ;`,
      values: [
        id,
        companyInputValues.name,
        companyInputValues.cnpj,
        companyInputValues.trade_name,
        companyInputValues.address,
      ],
    });

    return results.rows[0];
  }

  async validateUniqueCnpj(cnpj: string) {
    const results = await this.database.query({
      text: `
        SELECT
          cnpj
        FROM
          companies
        WHERE
          LOWER(cnpj) = LOWER($1)
        ;`,
      values: [cnpj],
    });

    if (results.rows.length) {
      throw new ValidationError({
        message: 'O cnpj informado já está sendo utilizado.',
        action: 'Utilize outro cnpj para realizar esta operação.',
        key: 'cnpj',
      });
    }
  }
}
