import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';

type CreateCompanyInput = {
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
};

@Injectable()
export class CompaniesService {
  constructor(private readonly repository: CompaniesRepository) {}

  create(companyInputValues: CreateCompanyInput) {
    return this.repository.create(companyInputValues);
  }
}
