import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres.' })
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @Length(14, 14, { message: 'O CNPJ deve conter exatamente 14 dígitos.' })
  @IsString({ message: 'O CNPJ deve ser um texto.' })
  @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
  cnpj: string;

  @IsString({ message: 'O nome fantasia deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome fantasia é obrigatório.' })
  trade_name: string;

  @IsString({ message: 'O endereço deve ser um texto.' })
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  address: string;
}
