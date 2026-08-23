import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from 'test/integration/api/v1/companies/dto/update-company.dto';
import { CreateCompanyDto } from 'test/integration/api/v1/companies/dto/create-company.dto';

@Controller('api/v1/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.companiesService.findOneById(id);
  }

  @Post()
  async create(@Body() body: CreateCompanyDto) {
    return this.companiesService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCompanyDto) {
    return this.companiesService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.companiesService.delete(id);
  }
}
