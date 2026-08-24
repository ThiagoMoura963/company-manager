import { Button, Stack } from '@primer/react';
import { Blankslate } from '@primer/react/experimental';
import { OrganizationIcon } from '@primer/octicons-react';
import { useNavigate } from 'react-router-dom';

import DefaultLayout from '../../interface/DefaultLayout';

export default function IndexPage() {
  const navigate = useNavigate();

  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: 'Início',
        description: 'Gerencie suas empresas.',
      }}
    >
      <Blankslate>
        <Stack align="center">
          <OrganizationIcon size="large" />

          <Blankslate.Heading>Bem-vindo ao Company Manager</Blankslate.Heading>

          <Blankslate.Description>
            Cadastre e consulte suas empresas de forma simples e organizada.
          </Blankslate.Description>

          <Stack gap="condensed" align="center">
            <Button
              variant="primary"
              onClick={() => navigate('/empresas/cadastrar')}
            >
              Cadastrar empresa
            </Button>

            <Button variant="invisible" onClick={() => navigate('/empresas')}>
              Ver empresas
            </Button>
          </Stack>
        </Stack>
      </Blankslate>
    </DefaultLayout>
  );
}
