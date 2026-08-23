import orchestrator from 'test/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  orchestrator.runPendingMigrations();
});

afterAll(async () => {
  await orchestrator.closeDatabase();
});

type CompanyResponse = {
  id: string;
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
  created_at: string;
  updated_at: string;
};

describe('GET /api/v1/companies', () => {
  test('Retrieving companies data', async () => {
    const createdCompany1 = await orchestrator.createCompany();
    const createCompany2 = await orchestrator.createCompany();

    const response = await fetch('http://localhost:3000/api/v1/companies');

    expect(response.status).toBe(200);

    const responseBody = (await response.json()) as CompanyResponse[];

    expect(responseBody).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdCompany1.id,
          name: createdCompany1.name,
          cnpj: createdCompany1.cnpj,
          trade_name: createdCompany1.trade_name,
          address: createdCompany1.address,
          created_at: createdCompany1.created_at.toISOString(),
          updated_at: createdCompany1.updated_at.toISOString(),
        }),
        expect.objectContaining({
          id: createCompany2.id,
          name: createCompany2.name,
          cnpj: createCompany2.cnpj,
          trade_name: createCompany2.trade_name,
          address: createCompany2.address,
          created_at: createCompany2.created_at.toISOString(),
          updated_at: createCompany2.updated_at.toISOString(),
        }),
      ]),
    );
  });
});
