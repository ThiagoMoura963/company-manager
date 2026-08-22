beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  orchestrator.runPendingMigrations();
});

afterAll(async () => {
  await orchestrator.closeDatabase();
});

import orchestrator from 'test/orchestrator';

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

describe('PATCH /api/v1/companies/[id]', () => {
  test('With duplicated `cnpj`', async () => {
    const createdCompany = await orchestrator.createCompany({
      cnpj: '69950103000119',
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cnpj: '69950103000119',
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

  test('With unique `cnpj`', async () => {
    const createdCompany = await orchestrator.createCompany();

    const companyInput: UpdateCompanyInput = {
      cnpj: '46083197000170',
    };

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyInput),
      },
    );

    expect(response.status).toBe(200);

    const responseBody = (await response.json()) as CompanyResponse;

    expect(responseBody).toEqual({
      id: responseBody.id,
      name: createdCompany.name,
      cnpj: '46083197000170',
      trade_name: createdCompany.trade_name,
      address: createdCompany.address,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });

    expect(responseBody.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );

    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });
});
