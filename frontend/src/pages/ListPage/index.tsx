import { Heading } from '@primer/react';
import DefaultLayout from '../../interface/DefaultLayout';

export default function ListPage() {
  return (
    <DefaultLayout
      contentWidth="medium"
      metadata={{
        title: 'Lista de Empresas',
        description: 'Lista de empresas cadastradas.',
      }}
    >
      <Heading as="h1">Lista de Empresas</Heading>
    </DefaultLayout>
  );
}
