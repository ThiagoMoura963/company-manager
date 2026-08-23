import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './errors/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from './errors/errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,

      exceptionFactory: (errors): ValidationError => {
        const [error] = errors;

        if (!error) {
          return new ValidationError();
        }

        const message = error.constraints
          ? Object.values(error.constraints)[0]
          : undefined;

        return new ValidationError({
          message: message ?? 'Os dados enviados são inválidos.',
          key: error.property,
        });
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
