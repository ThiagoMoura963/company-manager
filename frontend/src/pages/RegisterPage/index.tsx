import { Banner, Heading, Stack, Button } from '@primer/react';
import { ArrowLeftIcon } from '@primer/octicons-react';
import DefaultLayout from '../../interface/DefaultLayout';
import FormField from '../../interface/FormField';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createErrorMessage, formatCnpj } from '../../interface';

type CompanyFormData = {
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
};

type ApiErrorResponse = {
  name?: string;
  message?: string;
  action?: string;
  status_code?: number;
  key?: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: 'Cadastro',
        description: 'Cadastre uma nova empresa.',
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

        <Heading as="h1">Cadastrar Empresa</Heading>

        <RegisterForm navigate={navigate} />
      </Stack>
    </DefaultLayout>
  );
}

type RegisterFormProps = {
  navigate: ReturnType<typeof useNavigate>;
};

function RegisterForm({ navigate }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setFieldErrors({});
    setGlobalMessage(null);

    try {
      const requestBody: CompanyFormData = {
        name,
        cnpj,
        trade_name: tradeName,
        address,
      };

      const response = await fetch('http://localhost:3000/api/v1/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseBody = (await response.json()) as ApiErrorResponse;

      if (response.status === 201) {
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

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setGlobalMessage(
        'Não foi possível cadastrar a empresa. Tente novamente mais tarde.',
      );

      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="normal">
        <FormField
          label="Nome da Empresa"
          size="large"
          type="text"
          placeholder="Ex.: Acme Tecnologia Ltda."
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
        />

        <FormField
          label="CNPJ"
          size="large"
          type="text"
          placeholder="Ex.: 12.345.678/0001-90"
          value={cnpj}
          onChange={(event) => setCnpj(formatCnpj(event.target.value))}
          error={fieldErrors.cnpj}
        />

        <FormField
          label="Nome Fantasia"
          size="large"
          type="text"
          placeholder="Ex.: Acme Tech"
          value={tradeName}
          onChange={(event) => setTradeName(event.target.value)}
          error={fieldErrors.trade_name}
        />

        <FormField
          label="Endereço"
          size="large"
          type="text"
          placeholder="Ex.: Av. Paulista, 1000 - São Paulo/SP"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          error={fieldErrors.address}
        />

        {globalMessage && <Banner variant="critical" title={globalMessage} />}

        <Button
          block
          type="submit"
          size="large"
          variant="primary"
          disabled={isLoading}
          loading={isLoading}
        >
          Cadastrar empresa
        </Button>
      </Stack>
    </form>
  );
}
