import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ServiceError } from 'src/errors/errors';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('EMAIL_SMTP_HOST'),
      port: Number(this.configService.getOrThrow<string>('EMAIL_SMTP_PORT')),
      secure: false,
    });
  }

  async send(mailOptions: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }) {
    try {
      await this.transporter.sendMail({
        from: this.configService.getOrThrow<string>('EMAIL_FROM'),
        ...mailOptions,
      });
    } catch (error) {
      throw new ServiceError({
        message: 'Não foi possível enviar o email',
        action: 'Verifique se o serviço de email está disponível',
        cause: error,
        context: JSON.stringify(mailOptions),
      });
    }
  }
}
