import {
  Heading,
  Stack,
  Button,
  Banner,
  Text,
  IconButton,
} from '@primer/react';
import DefaultLayout from '../../interface/DefaultLayout';
import { DataTable, SkeletonText, Table } from '@primer/react/experimental';
import { PlusIcon, PencilIcon, TrashIcon } from '@primer/octicons-react';

import useSWR from 'swr';

type Company = {
  id: string;
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
  created_at: string;
  updated_at: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
}

async function fetchAPI<T>(key: string): Promise<T> {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function ListPage() {
  return (
    <DefaultLayout
      contentWidth="xlarge"
      metadata={{
        title: 'Empresas',
        description: 'Lista de empresas cadastradas.',
      }}
    >
      <Stack gap="spacious">
        <Stack direction="horizontal" justify="space-between" align="center">
          <Heading as="h1">Empresas</Heading>
          <Button as="a" href="/empresas/cadastrar" variant="primary">
            <PlusIcon size={16} />
            Cadastrar Nova Empresa
          </Button>
        </Stack>

        <CompanyList />
      </Stack>
    </DefaultLayout>
  );
}

function CompanyList() {
  const {
    data: companies,
    error,
    isLoading,
  } = useSWR<Company[]>('http://localhost:3000/api/v1/companies', fetchAPI);

  if (isLoading) {
    return <CompanyListSkeleton />;
  }

  if (error) {
    return (
      <Banner
        variant="critical"
        title="Não foi possível carregar as empresas"
      />
    );
  }

  if (!companies || companies.length === 0) {
    return <Text size="medium">Nenhuma empresa cadastrada.</Text>;
  }

  return (
    <Table.Container>
      <DataTable
        aria-labelledby="companies-list"
        data={companies}
        columns={[
          {
            header: 'Nome',
            field: 'name',
            rowHeader: true,
          },
          {
            header: 'CNPJ',
            field: 'cnpj',
          },
          {
            header: 'Nome Fantasia',
            field: 'trade_name',
          },
          {
            header: 'Endereço',
            field: 'address',
          },
          {
            header: 'Criado em',
            field: 'created_at',
            renderCell: (row) => formatDate(row.created_at),
          },
          {
            header: 'Alterado em',
            field: 'updated_at',
            renderCell: (row) => formatDate(row.updated_at),
          },
          {
            id: 'actions',
            header: () => (
              <span
                style={{
                  clipPath: 'inset(50%)',
                  height: '1px',
                  overflow: 'hidden',
                  position: 'absolute',
                  whiteSpace: 'nowrap',
                  width: '1px',
                }}
              >
                Ações
              </span>
            ),
            renderCell: (row) => (
              <>
                <IconButton
                  aria-label={'Editar'}
                  icon={PencilIcon}
                  variant="invisible"
                  as="a"
                  href={`/empresas/editar/${row.id}`}
                />

                <IconButton
                  aria-label={'Excluir'}
                  icon={TrashIcon}
                  variant="invisible"
                />
              </>
            ),
          },
        ]}
      />
    </Table.Container>
  );
}

function CompanyListSkeleton() {
  return (
    <Stack gap="normal">
      <SkeletonText size="titleMedium" />

      <Stack gap="condensed">
        <SkeletonText size="bodyLarge" />
        <SkeletonText size="bodyLarge" />
        <SkeletonText size="bodyLarge" />
        <SkeletonText size="bodyLarge" />
        <SkeletonText size="bodyLarge" />
      </Stack>
    </Stack>
  );
}
