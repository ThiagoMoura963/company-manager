import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

import { IsCnpj } from 'src/common/validator/is-cnpj.validator';

export class CreateCompanyDto {
  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.trim();
  })
  @MaxLength(255, {
    message: 'O nome deve ter no máximo 255 caracteres.',
  })
  @IsString({
    message: 'O nome deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'O nome é obrigatório.',
  })
  name: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.replace(/\D/g, '');
  })
  @IsCnpj({
    message: 'O CNPJ informado é inválido.',
  })
  @Length(14, 14, {
    message: 'O CNPJ deve conter exatamente 14 dígitos.',
  })
  @IsString({
    message: 'O CNPJ deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'O CNPJ é obrigatório.',
  })
  cnpj: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.trim();
  })
  @IsString({
    message: 'O nome fantasia deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'O nome fantasia é obrigatório.',
  })
  trade_name: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.trim();
  })
  @IsString({
    message: 'O endereço deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'O endereço é obrigatório.',
  })
  address: string;
}
