import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';

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
  constructor(
    private readonly repository: CompaniesRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findOneById(id: string) {
    return await this.repository.findOneById(id);
  }

  async create(companyInputValues: CreateCompanyInput) {
    await this.repository.validateUniqueCnpj(companyInputValues.cnpj);

    const newCompany = await this.repository.create(companyInputValues);

    await this.emailService.send({
      to: this.configService.getOrThrow<string>('EMAIL_NOTIFICATION_TO'),
      subject: 'Nova empresa cadastrada',
      text: `
Nova empresa foi cadastrada.

Nome: ${newCompany.name}
CNPJ: ${newCompany.cnpj}
Nome Fantasia: ${newCompany.trade_name}
Endereço: ${newCompany.address}
      `,
    });

    return newCompany;
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
