import { Banner, Button, Heading, Stack } from '@primer/react';
import { SkeletonText } from '@primer/react/experimental';
import { ArrowLeftIcon } from '@primer/octicons-react';
import DefaultLayout from '../../interface/DefaultLayout';
import FormField from '../../interface/FormField';
import type React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { createErrorMessage, formatCnpj } from '../../interface';
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

type ApiErrorResponse = {
  name?: string;
  message?: string;
  action?: string;
  status_code?: number;
  key?: string;
};

async function fetchAPI<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Não foi possível carregar a empresa');
  }

  return response.json();
}

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: 'Editar Empresa',
        description: 'Atualize os dados da empresa',
      }}
    >
      <Stack gap="spacious">
        <Stack align="start">
          <Button
            leadingVisual={ArrowLeftIcon}
            variant="invisible"
            onClick={() => navigate('/empresas')}
          >
            Voltar
          </Button>
        </Stack>

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CompanyFormData, string>>
  >({});

  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  const KNOWN_FIELDS: Array<keyof CompanyFormData> = [
    'name',
    'cnpj',
    'trade_name',
    'address',
  ];

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

    if (!companyId) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setGlobalMessage(null);

    try {
      const requestBody: CompanyFormData = {
        name: currentName,
        cnpj: currentCnpj,
        trade_name: currentTradeName,
        address: currentAddress,
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

      const responseBody = (await response.json()) as ApiErrorResponse;

      if (response.status === 200) {
        navigate('/empresas');
        return;
      }

      if (
        response.status === 400 &&
        responseBody.key &&
        KNOWN_FIELDS.includes(responseBody.key as keyof CompanyFormData)
      ) {
        const field = responseBody.key as keyof CompanyFormData;

        setFieldErrors({
          [field]: createErrorMessage(responseBody, {
            omitAction: true,
          }),
        });
      } else {
        setGlobalMessage(createErrorMessage(responseBody));
      }
    } catch (error) {
      console.error(error);

      setGlobalMessage(
        'Não foi possível atualizar a empresa. Tente novamente mais tarde.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="normal">
        <FormField
          label="Nome"
          size="large"
          type="text"
          placeholder="Ex.: Acme Tecnologia Ltda."
          value={currentName}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
        />

        <FormField
          label="CNPJ"
          size="large"
          type="text"
          placeholder="Ex.: 12.345.678/0001-90"
          value={formatCnpj(currentCnpj)}
          onChange={(event) => setCnpj(formatCnpj(event.target.value))}
          error={fieldErrors.cnpj}
        />

        <FormField
          label="Nome Fantasia"
          size="large"
          type="text"
          placeholder="Ex.: Acme Tech"
          value={currentTradeName}
          onChange={(event) => setTradeName(event.target.value)}
          error={fieldErrors.trade_name}
        />

        <FormField
          label="Endereço"
          size="large"
          type="text"
          placeholder="Ex.: Av. Paulista, 1000 - São Paulo/SP"
          value={currentAddress}
          onChange={(event) => setAddress(event.target.value)}
          error={fieldErrors.address}
        />

        {globalMessage && <Banner variant="critical" title={globalMessage} />}

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
