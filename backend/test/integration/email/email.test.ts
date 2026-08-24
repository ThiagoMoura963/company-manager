import orchestrator from 'test/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe('email/email.service.ts', () => {
  test('send()', async () => {
    await orchestrator.deleteAllEmails();

    const email = orchestrator.getEmailService();

    await email.send({
      to: 'teste@gmail.com',
      subject: 'Teste de assunto',
      text: 'Teste de corpo',
    });

    await email.send({
      to: 'teste@gmail.com',
      subject: 'Último assunto',
      text: 'Último corpo',
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe('<no-reply@company-manager.local>');
    expect(lastEmail.recipients[0]).toBe('<teste@gmail.com>');
    expect(lastEmail.subject).toBe('Último assunto');
    expect(lastEmail.text).toBe('Último corpo\r\n');
  });
});
