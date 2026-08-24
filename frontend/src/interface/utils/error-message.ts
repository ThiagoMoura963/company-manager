type ErrorResponseBody = {
  message?: string;
  action?: string;
};

type CreateErrorMessageOptions = {
  omitAction?: boolean;
};

export default function createErrorMessage(
  responseBody: ErrorResponseBody | null | undefined,
  { omitAction = false }: CreateErrorMessageOptions = {},
): string {
  const { message, action } = responseBody ?? {};

  const errorMessages: string[] = [];

  if (message) {
    errorMessages.push(message);
  }

  if (action && !omitAction) {
    errorMessages.push(action);
  }

  return (
    errorMessages.join(' ') || 'Erro desconhecido. Tente novamente mais tarde.'
  );
}
