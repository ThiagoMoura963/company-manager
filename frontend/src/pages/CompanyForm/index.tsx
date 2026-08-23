import { Heading } from '@primer/react';
import DefaultLayout from '../../interface/DefaultLayout';

export default function CompanyForm() {
  return (
    <>
      <DefaultLayout
        contentWidth="small"
        metadata={{
          title: 'Cadastro',
          description: 'Cadastre uma nova empresa.',
        }}
      >
        <Heading as="h1">Cadastrar Nova Empresa</Heading>
      </DefaultLayout>
    </>
  );
}
