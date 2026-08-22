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

describe('POST /api/v1/companies', () => {
  test('With unique and valid data', async () => {
    const companyInput: CreateCompanyInput = {
      name: 'Empresa Teste',
      cnpj: '12345678000190',
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
