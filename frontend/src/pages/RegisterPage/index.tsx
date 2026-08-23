import { FormControl, Heading, Stack, TextInput, Button } from '@primer/react';
import DefaultLayout from '../../interface/DefaultLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type CompanyFormData = {
  name: string;
  cnpj: string;
  trade_name: string;
  address: string;
};

export default function RegisterPage() {
  return (
    <>
      <DefaultLayout
        contentWidth="small"
        metadata={{
          title: 'Cadastro',
          description: 'Cadastre uma nova empresa.',
        }}
      >
        <Stack gap="spacious">
          <Heading as="h1">Cadastrar Empresa</Heading>
          <RegisterForm />
        </Stack>
      </DefaultLayout>
    </>
  );
}

function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [cnpj, setCnpj] = useState<string>('');
  const [tradeName, setTradeName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

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

      if (response.status === 201) {
        navigate('/empresas');
        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack gap="normal">
          <FormControl>
            <FormControl.Label>Nome da Empresa</FormControl.Label>
            <TextInput
              block
              size="large"
              type="text"
              placeholder="Ex.: Acme Tecnologia Ltda."
              value={name}
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
              value={cnpj}
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
              value={tradeName}
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
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </FormControl>

          <Button
            block
            type="submit"
            size="large"
            variant="primary"
            disabled={isLoading}
            loading={isLoading}
          >
            Criar empresa
          </Button>
        </Stack>
      </form>
    </>
  );
}
