import {
  Heading,
  Stack,
  Button,
  Banner,
  Text,
  IconButton,
  ConfirmationDialog,
  TextInput,
} from '@primer/react';
import DefaultLayout from '../../interface/DefaultLayout';
import { formatCnpj, formatDate } from '../../interface';
import { DataTable, SkeletonText, Table } from '@primer/react/experimental';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
} from '@primer/octicons-react';
import { useMemo, useState } from 'react';
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

async function fetchAPI<T>(key: string): Promise<T> {
  const response = await fetch(key);

  if (!response.ok) {
    throw new Error('Não foi possível carregar as empresas');
  }

  return response.json();
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
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  const {
    data: companies,
    error,
    isLoading,
    mutate,
  } = useSWR<Company[]>('http://localhost:3000/api/v1/companies', fetchAPI);

  const filteredCompanies = useMemo(() => {
    if (!companies) {
      return [];
    }

    const normalizedSearch = search.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return companies;
    }

    return companies.filter((company) => {
      return [
        company.name,
        company.cnpj,
        company.trade_name,
        company.address,
      ].some((field) => field.toLocaleLowerCase().includes(normalizedSearch));
    });
  }, [companies, search]);

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

  async function handleDelete(companyId: string) {
    setDeletingId(companyId);

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/companies/${companyId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Não foi possível excluir a empresa');
      }

      setCompanyToDelete(null);
      await mutate();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  }

  if (!companies || companies.length === 0) {
    return <Text size="medium">Nenhuma empresa cadastrada.</Text>;
  }

  return (
    <>
      <TextInput
        leadingVisual={SearchIcon}
        placeholder="Buscar por nome, CNPJ, nome fantasia ou endereço"
        aria-label="Buscar empresas"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {filteredCompanies.length === 0 ? (
        <Text size="medium">Nenhuma empresa encontrada para "{search}".</Text>
      ) : (
        <Table.Container>
          <DataTable
            aria-labelledby="companies-list"
            data={filteredCompanies}
            columns={[
              {
                header: 'Nome',
                field: 'name',
                rowHeader: true,
              },
              {
                header: 'CNPJ',
                field: 'cnpj',
                renderCell: (row) => formatCnpj(row.cnpj),
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
                      aria-label="Editar"
                      icon={PencilIcon}
                      variant="invisible"
                      as="a"
                      href={`/empresas/editar/${row.id}`}
                    />

                    <IconButton
                      aria-label="Excluir"
                      icon={TrashIcon}
                      variant="invisible"
                      onClick={() => setCompanyToDelete(row)}
                      disabled={deletingId === row.id}
                    />
                  </>
                ),
              },
            ]}
          />

          {companyToDelete ? (
            <ConfirmationDialog
              title={`Excluir ${companyToDelete.name}?`}
              width="large"
              height="auto"
              confirmButtonContent="Excluir"
              cancelButtonContent="Cancelar"
              confirmButtonType="danger"
              onClose={(reason) => {
                if (reason === 'confirm') {
                  handleDelete(companyToDelete.id);
                } else {
                  setCompanyToDelete(null);
                }
              }}
            >
              Tem certeza que deseja excluir esta empresa? Essa ação não pode
              ser desfeita.
            </ConfirmationDialog>
          ) : null}
        </Table.Container>
      )}
    </>
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
