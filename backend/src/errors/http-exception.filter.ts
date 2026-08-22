import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import type { Response } from 'express';

import {
  InternalServerError,
  ServiceError,
  ValidationError,
  NotFoundError,
} from './errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (
      exception instanceof ValidationError ||
      exception instanceof NotFoundError ||
      exception instanceof ServiceError
    ) {
      response.status(exception.getStatus()).json(exception.getResponse());

      return;
    }

    const publicError = new InternalServerError({
      cause: exception instanceof Error ? exception : undefined,
    });

    console.error(publicError);

    response.status(publicError.getStatus()).json(publicError.getResponse());
  }
}
