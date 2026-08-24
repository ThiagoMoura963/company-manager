import {
  Stack,
  Heading,
  FormControl,
  TextInput,
  Button,
  Banner,
} from '@primer/react';
import { SkeletonText } from '@primer/react/experimental';

import DefaultLayout from '../../interface/DefaultLayout';
import type React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import useSWR from 'swr';

type CompanyFormData = {
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
};

type Company = CompanyFormData & {
  id: string;
  created_at: string;
  updated_at: string;
};

async function fetchAPI<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const responseBody = await response.json();

  return responseBody;
}

export default function EditPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: 'Editar Empresa',
        description: 'Atualize os dados da empresa',
      }}
    >
      <Stack gap="spacious">
        <Heading as="h1">Editar Empresa</Heading>

        <EditForm companyId={id} />
      </Stack>
    </DefaultLayout>
  );
}

type EditFormProps = {
  companyId?: string;
};

function EditForm({ companyId }: EditFormProps) {
  const navigate = useNavigate();

  const {
    data: company,
    error,
    isLoading,
  } = useSWR<Company>(
    `http://localhost:3000/api/v1/companies/${companyId}`,
    fetchAPI,
  );

  const [name, setName] = useState<string>();
  const [cnpj, setCnpj] = useState<string>();
  const [tradeName, setTradeName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (isLoading) {
    return <EditFormSkeleton />;
  }

  if (error) {
    return (
      <Banner variant="critical" title="Não foi possível carregar a empresa" />
    );
  }

  if (!company) {
    return <Banner variant="critical" title="Empresa não encontrada" />;
  }

  const currentName = name ?? company.name;
  const currentCnpj = cnpj ?? company.cnpj;
  const currentTradeName = tradeName ?? company.trade_name;
  const currentAddress = address ?? company.address;

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    if (!companyId) return;

    try {
      const requestBody = {
        name,
        cnpj,
        trade_name: tradeName,
        address,
      };

      const response = await fetch(
        `http://localhost:3000/api/v1/companies/${companyId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (response.status === 200) {
        navigate('/empresas');
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="normal">
        <FormControl>
          <FormControl.Label>Nome</FormControl.Label>
          <TextInput
            block
            size="large"
            type="text"
            placeholder="Ex.: Acme Tecnologia Ltda."
            value={currentName}
            onChange={(event) => setName(event.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>CNPJ</FormControl.Label>
          <TextInput
            block
            size="large"
            type="text"
            placeholder="Ex.: 12.345.678/0001-90"
            value={currentCnpj}
            onChange={(event) => setCnpj(event.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Nome Fantasia</FormControl.Label>
          <TextInput
            block
            size="large"
            type="text"
            placeholder="Ex.: Acme Tech"
            value={currentTradeName}
            onChange={(event) => setTradeName(event.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Endereço</FormControl.Label>
          <TextInput
            block
            size="large"
            type="text"
            placeholder="Ex.: Av. Paulista, 1000 - São Paulo/SP"
            value={currentAddress}
            onChange={(event) => setAddress(event.target.value)}
          />
        </FormControl>

        <Button
          block
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Salvar alterações
        </Button>
      </Stack>
    </form>
  );
}

function EditFormSkeleton() {
  return (
    <Stack gap="normal">
      <Stack gap="condensed">
        <SkeletonText size="bodyLarge" />
      </Stack>

      <Stack gap="condensed">
        <SkeletonText size="bodyLarge" />
      </Stack>

      <Stack gap="condensed">
        <SkeletonText size="bodyLarge" />
      </Stack>

      <Stack gap="condensed">
        <SkeletonText size="bodyLarge" />
      </Stack>

      <Stack gap="condensed">
        <SkeletonText size="bodyLarge" />
      </Stack>
    </Stack>
  );
}
