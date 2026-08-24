import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCnpj',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string' || value.length !== 14) {
            return false;
          }

          if (/^(\d)\1+$/.test(value)) {
            return false;
          }

          const numbers = value.split('').map(Number);

          let sum = 0;
          let weight = 5;

          for (let i = 0; i < 12; i++) {
            sum += numbers[i] * weight;
            weight = weight === 2 ? 9 : weight - 1;
          }

          let remainder = sum % 11;
          const firstDigit = remainder < 2 ? 0 : 11 - remainder;

          if (numbers[12] !== firstDigit) {
            return false;
          }

          sum = 0;
          weight = 6;

          for (let i = 0; i < 13; i++) {
            sum += numbers[i] * weight;
            weight = weight === 2 ? 9 : weight - 1;
          }

          remainder = sum % 11;
          const secondDigit = remainder < 2 ? 0 : 11 - remainder;

          return numbers[13] === secondDigit;
        },
      },
    });
  };
}
