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

type NotFoundErrorResponse = {
  name: 'NotFoundError';
  message: string;
  action: string;
  status_code: 400;
  key: string;
};

describe('GET /api/v1/companies/[id]', () => {
  describe('Retrieving company data', () => {
    test('With nonexistent id', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/companies/9dd9ab0c-57a0-4e67-ac12-a4f8b188b637',
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

    test('With valid id', async () => {
      const createdCompany = await orchestrator.createCompany({
        name: 'Empresa C',
        cnpj: '56905541000113',
        trade_name: 'Empresa C',
        address: 'São Paulo - SP',
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      );

      expect(response.status).toBe(200);

      const responseBody = (await response.json()) as CompanyResponse;

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: 'Empresa C',
        cnpj: '56905541000113',
        trade_name: 'Empresa C',
        address: 'São Paulo - SP',
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(responseBody.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(responseBody.created_at).not.toBeNaN();
      expect(responseBody.updated_at).not.toBeNaN();
    });
  });
});
