import { HttpException, HttpStatus } from '@nestjs/common';

type ValidationErrorOptions = {
  cause?: unknown;
  message?: string;
  action?: string;
  key?: string;
};

export class ValidationError extends HttpException {
  constructor({
    cause,
    message = 'Um erro de validação ocorreu.',
    action = 'Ajuste os dados enviados e tente novamente.',
    key,
  }: ValidationErrorOptions = {}) {
    super(
      {
        name: 'ValidationError',
        message,
        action,
        status_code: HttpStatus.BAD_REQUEST,
        key,
      },
      HttpStatus.BAD_REQUEST,
      { cause },
    );
  }
}

type NotFoundErrorOptions = {
  cause?: unknown;
  message?: string;
  action?: string;
};

export class NotFoundError extends HttpException {
  constructor({
    cause,
    message = 'Não foi possível encontrar este recurso.',
    action = 'Verifique se os parâmetros da consulta estão corretos.',
  }: NotFoundErrorOptions = {}) {
    super(
      {
        name: 'NotFoundError',
        message,
        action,
        status_code: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
      { cause },
    );
  }
}

type ServiceErrorOptions = {
  cause?: unknown;
  message?: string;
  action?: string;
  context?: string;
};

export class ServiceError extends HttpException {
  constructor({
    cause,
    message = 'Serviço indisponível no momento.',
    action = 'Verifique se o serviço está disponível.',
    context,
  }: ServiceErrorOptions = {}) {
    super(
      {
        name: 'ServiceError',
        message,
        action,
        status_code: HttpStatus.SERVICE_UNAVAILABLE,
        context,
      },
      HttpStatus.SERVICE_UNAVAILABLE,
      {
        cause,
      },
    );
  }
}

type InternalServerErrorOptions = {
  cause?: unknown;
  message?: string;
};

export class InternalServerError extends HttpException {
  constructor({
    cause,
    message = 'Um erro interno não esperado aconteceu.',
  }: InternalServerErrorOptions = {}) {
    super(
      {
        name: 'InternalServerError',
        message,
        action: 'Entre em contato com o suporte.',
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        cause,
      },
    );
  }
}
