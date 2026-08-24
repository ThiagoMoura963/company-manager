import { Blankslate } from '@primer/react/experimental';
import { OrganizationIcon } from '@primer/octicons-react';

import DefaultLayout from '../../interface/DefaultLayout';

export default function IndexPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: 'Início',
        description: 'Gerencie suas empresas.',
      }}
    >
      <Blankslate>
        <OrganizationIcon size="large" />

        <Blankslate.Heading>Bem-vindo ao Company Manager</Blankslate.Heading>

        <Blankslate.Description>
          Cadastre e consulte suas empresas de forma simples e organizada.
        </Blankslate.Description>

        <Blankslate.PrimaryAction href="/empresas/cadastrar">
          Cadastrar empresa
        </Blankslate.PrimaryAction>

        <Blankslate.SecondaryAction href="/empresas">
          Ver empresas
        </Blankslate.SecondaryAction>
      </Blankslate>
    </DefaultLayout>
  );
}
