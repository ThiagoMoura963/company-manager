import orchestrator from 'test/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  orchestrator.runPendingMigrations();
});

afterAll(async () => {
  await orchestrator.closeDatabase();
});

type UpdateCompanyInput = {
  name?: string;
  cnpj?: string;
  trade_name?: string;
  address?: string;
};

type CompanyResponse = {
  id: string;
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
  created_at: string;
  updated_at: string;
};

type ValidationErrorResponse = {
  name: 'ValidationError';
  message: string;
  action: string;
  status_code: 400;
  key: string;
};

type NotFoundErrorResponse = {
  name: 'NotFoundError';
  message: string;
  action: string;
  status_code: 404;
};

describe('PATCH /api/v1/companies/[id]', () => {
  test('With nonexistent `id`', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/companies/f255dced-8d00-438f-b543-307b4d57748e',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Empresa Fantasma',
        } satisfies UpdateCompanyInput),
      },
    );

    expect(response.status).toBe(404);

    const responseBody = (await response.json()) as NotFoundErrorResponse;

    expect(responseBody).toEqual({
      name: 'NotFoundError',
      message: 'O id enviado não existe dentro do sistema.',
      action: 'Verifique se o id está digitado corretamente.',
      status_code: 404,
    });
  });

  test('With unique and valid data', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Empresa Atualizada',
        } satisfies UpdateCompanyInput),
      },
    );

    expect(response.status).toBe(200);

    const responseBody = (await response.json()) as CompanyResponse;

    expect(responseBody).toEqual({
      id: createdCompany.id,
      name: 'Empresa Atualizada',
      cnpj: createdCompany.cnpj,
      trade_name: createdCompany.trade_name,
      address: createdCompany.address,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
  });

  test('With empty `name`', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '',
        } satisfies UpdateCompanyInput),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O nome é obrigatório.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'name',
    });
  });

  test('With `name` as number', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 123456,
        } satisfies Omit<UpdateCompanyInput, 'name'> & { name: number }),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O nome deve ser um texto.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'name',
    });
  });

  test('With `name` longer than 255 characters', async () => {
    const createdCompany = await orchestrator.createCompany();
    const longName = 'a'.repeat(256);

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: longName,
        } satisfies UpdateCompanyInput),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O nome deve ter no máximo 255 caracteres.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'name',
    });
  });

  test('With empty `cnpj`', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cnpj: '',
        } satisfies UpdateCompanyInput),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O CNPJ é obrigatório.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'cnpj',
    });
  });

  test('With `cnpj` as number', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cnpj: 11444777000161,
        } satisfies Omit<UpdateCompanyInput, 'cnpj'> & { cnpj: number }),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O CNPJ deve ser um texto.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'cnpj',
    });
  });

  test('With `cnpj` shorter than 14 digits', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cnpj: '1144477700016',
        } satisfies UpdateCompanyInput),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O CNPJ deve conter exatamente 14 dígitos.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'cnpj',
    });
  });

  test('With `cnpj` longer than 14 digits', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cnpj: '114447770001611',
        } satisfies UpdateCompanyInput),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O CNPJ deve conter exatamente 14 dígitos.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'cnpj',
    });
  });

  test('With `cnpj` already in use by another company', async () => {
    const createdCompany = await orchestrator.createCompany();
    const otherCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cnpj: otherCompany.cnpj,
        } satisfies UpdateCompanyInput),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O cnpj informado já está sendo utilizado.',
      action: 'Utilize outro cnpj para realizar esta operação.',
      status_code: 400,
      key: 'cnpj',
    });
  });

  test('With empty `trade_name`', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trade_name: '',
        } satisfies UpdateCompanyInput),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O nome fantasia é obrigatório.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'trade_name',
    });
  });

  test('With `trade_name` as number', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trade_name: 123456,
        } satisfies Omit<UpdateCompanyInput, 'trade_name'> & {
          trade_name: number;
        }),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O nome fantasia deve ser um texto.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'trade_name',
    });
  });

  test('With empty `address`', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: '',
        } satisfies UpdateCompanyInput),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O endereço é obrigatório.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'address',
    });
  });

  test('With `address` as number', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: 123456,
        } satisfies Omit<UpdateCompanyInput, 'address'> & {
          address: number;
        }),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = (await response.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O endereço deve ser um texto.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'address',
    });
  });
});
