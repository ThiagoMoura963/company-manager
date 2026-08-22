import { Body, Controller, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';

type CreateCompanyInput = {
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
};

@Controller('api/v1/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() body: CreateCompanyInput) {
    return this.companiesService.create(body);
  }
}
