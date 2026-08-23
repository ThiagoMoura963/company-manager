import orchestrator from 'test/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  orchestrator.runPendingMigrations();
});

afterAll(async () => {
  await orchestrator.closeDatabase();
});

type NotFoundErrorResponse = {
  name: 'NotFoundError';
  message: string;
  action: string;
  status_code: 400;
  key: string;
};

describe('DELETE /api/v1/companies/[id]', () => {
  test('With nonexistent `id`', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/companies/f255dced-8d00-438f-b543-307b4d57748e',
      {
        method: 'DELETE',
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

  test('With existing `id`', async () => {
    const createdCompany = await orchestrator.createCompany();

    const response = await fetch(
      `http://localhost:3000/api/v1/companies/${createdCompany.id}`,
      {
        method: 'DELETE',
      },
    );

    expect(response.status).toBe(204);
  });
});
