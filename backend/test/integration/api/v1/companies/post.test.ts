import orchestrator from 'test/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

afterAll(async () => {
  await orchestrator.closeDatabase();
});

type CreateCompanyInput = {
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
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

describe('POST /api/v1/companies', () => {
  test('With unique and valid data', async () => {
    const companyInput: CreateCompanyInput = {
      name: 'Empresa Teste',
      cnpj: '98167650000120',
      trade_name: 'Empresa Teste',
      address: 'Santos - SP',
    };

    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyInput),
    });

    expect(response.status).toBe(201);

    const responseBody = (await response.json()) as CompanyResponse;

    expect(responseBody).toEqual({
      id: responseBody.id,
      name: companyInput.name,
      cnpj: companyInput.cnpj,
      trade_name: companyInput.trade_name,
      address: companyInput.address,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });

    expect(responseBody.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );

    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail).not.toBeNull();
    expect(lastEmail?.sender).toBe('<no-reply@company-manager.local>');
    expect(lastEmail?.recipients[0]).toBe('<admin@company-manager.local>');
    expect(lastEmail?.subject).toBe('Nova empresa cadastrada');

    expect(lastEmail?.text).toContain('Nova empresa foi cadastrada.');
    expect(lastEmail?.text).toContain(`Nome: ${companyInput.name}`);
    expect(lastEmail?.text).toContain(`CNPJ: ${companyInput.cnpj}`);
    expect(lastEmail?.text).toContain(
      `Nome Fantasia: ${companyInput.trade_name}`,
    );
    expect(lastEmail?.text).toContain(`Endereço: ${companyInput.address}`);
  });

  test('With duplicated `cnpj`', async () => {
    const response1 = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa A',
        trade_name: 'Empresa A',
        cnpj: '12345678000190',
        address: 'Rio de Janeiro - RJ',
      } satisfies CreateCompanyInput),
    });

    expect(response1.status).toBe(201);

    const response2 = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa B',
        trade_name: 'Empresa B',
        cnpj: '12345678000190',
        address: 'São Paulo - SP',
      } satisfies CreateCompanyInput),
    });

    expect(response2.status).toBe(400);

    const response2Body = (await response2.json()) as ValidationErrorResponse;

    expect(response2Body).toEqual({
      name: 'ValidationError',
      message: 'O cnpj informado já está sendo utilizado.',
      action: 'Utilize outro cnpj para realizar esta operação.',
      status_code: 400,
      key: 'cnpj',
    });
  });

  test('With empty `name`', async () => {
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '',
        trade_name: 'Empresa C',
        cnpj: '11444777000161',
        address: 'Curitiba - PR',
      } satisfies CreateCompanyInput),
    });

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

  test('With missing `name` key', async () => {
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trade_name: 'Empresa C',
        cnpj: '11444777000161',
        address: 'Curitiba - PR',
      } satisfies Omit<CreateCompanyInput, 'name'>),
    });

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
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 123456,
        trade_name: 'Empresa C',
        cnpj: '11444777000161',
        address: 'Curitiba - PR',
      } satisfies Omit<CreateCompanyInput, 'name'> & { name: number }),
    });

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

  test('With empty `cnpj`', async () => {
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        trade_name: 'Empresa C',
        cnpj: '',
        address: 'Curitiba - PR',
      } satisfies CreateCompanyInput),
    });

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

  test('With missing `cnpj` key', async () => {
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        trade_name: 'Empresa C',
        address: 'Curitiba - PR',
      } satisfies Omit<CreateCompanyInput, 'cnpj'>),
    });

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
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        trade_name: 'Empresa C',
        cnpj: 11444777000161,
        address: 'Curitiba - PR',
      } satisfies Omit<CreateCompanyInput, 'cnpj'> & { cnpj: number }),
    });

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

  test('With `cnpj` shorther than 14 digits', async () => {
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        trade_name: 'Empresa C',
        cnpj: '1144477700016',
        address: 'Curitiba - PR',
      } satisfies CreateCompanyInput),
    });

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
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        trade_name: 'Empresa C',
        cnpj: '114447770001611',
        address: 'Curitiba - PR',
      } satisfies CreateCompanyInput),
    });

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

  test('With `name` longer than 255 characteres', async () => {
    const longName = 'a'.repeat(256);

    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: longName,
        trade_name: 'Empresa C',
        cnpj: '11444777000161',
        address: 'Curitiba - PR',
      } satisfies CreateCompanyInput),
    });

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

  test('With empty `trade_name`', async () => {
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        trade_name: '',
        cnpj: '11444777000161',
        address: 'Curitiba - PR',
      } satisfies CreateCompanyInput),
    });

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

  test('With missing `trade_name` key', async () => {
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        cnpj: '11444777000161',
        address: 'Curitiba - PR',
      } satisfies Omit<CreateCompanyInput, 'trade_name'>),
    });

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
    const resposne = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        trade_name: 123456,
        cnpj: '11444777000161',
        address: 'Curitiba - PR',
      } satisfies Omit<CreateCompanyInput, 'trade_name'> & {
        trade_name: number;
      }),
    });

    expect(resposne.status).toBe(400);

    const responseBody = (await resposne.json()) as ValidationErrorResponse;

    expect(responseBody).toEqual({
      name: 'ValidationError',
      message: 'O nome fantasia deve ser um texto.',
      action: 'Ajuste os dados enviados e tente novamente.',
      status_code: 400,
      key: 'trade_name',
    });
  });

  test('With empty `address`', async () => {
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        trade_name: 'Empresa C',
        cnpj: '11444777000161',
        address: '',
      } satisfies CreateCompanyInput),
    });

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

  test('With missing `address` key', async () => {
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        trade_name: 'Empresa C',
        cnpj: '11444777000161',
      } satisfies Omit<CreateCompanyInput, 'address'>),
    });

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

  test('With `name` as number', async () => {
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Empresa C',
        trade_name: 'Empresa C',
        cnpj: '11444777000161',
        address: 123456,
      } satisfies Omit<CreateCompanyInput, 'address'> & { address: number }),
    });

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
