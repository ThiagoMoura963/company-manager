import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('/api/v1/health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  check() {
    return {
      status: 'ok',
      appName: this.configService.get<string>('APP_NAME'),
    };
  }
}
