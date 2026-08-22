import orchestrator from 'test/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  orchestrator.runPendingMigrations();
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
  });
});
