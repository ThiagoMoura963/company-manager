import { Injectable } from '@nestjs/common';

@Injectable()
export class CompaniesService {
  create(data: unknown) {
    return data;
  }
}
