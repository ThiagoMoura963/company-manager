import { Body, Controller, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('api/v1/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.companiesService.create(body);
  }
}
