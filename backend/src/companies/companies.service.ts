import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';

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

@Injectable()
export class CompaniesService {
  constructor(private readonly repository: CompaniesRepository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findOneById(id: string) {
    return await this.repository.findOneById(id);
  }

  async create(companyInputValues: CreateCompanyInput) {
    await this.repository.validateUniqueCnpj(companyInputValues.cnpj);

    return this.repository.create(companyInputValues);
  }

  async update(id: string, companyInputValues: UpdateCompanyInput) {
    const currentCompany = await this.repository.findOneById(id);

    if ('cnpj' in companyInputValues) {
      if (companyInputValues.cnpj !== undefined) {
        await this.repository.validateUniqueCnpj(companyInputValues.cnpj);
      }
    }

    const companyWithNewValues = { ...currentCompany, ...companyInputValues };

    return this.repository.update(id, companyWithNewValues);
  }

  async delete(id: string) {
    await this.repository.delete(id);
  }
}
