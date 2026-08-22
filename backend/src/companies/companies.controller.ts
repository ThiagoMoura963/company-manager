import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';

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

@Controller('api/v1/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() body: CreateCompanyInput) {
    return this.companiesService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCompanyInput) {
    return this.companiesService.update(id, body);
  }
}
