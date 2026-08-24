import { PageLayout, Header, Text } from '@primer/react';
import { OrganizationIcon } from '@primer/octicons-react';
import { Helmet } from 'react-helmet-async';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../DefaultLayout/index.module.css';

type ContentWidth = 'small' | 'medium' | 'large' | 'xlarge' | 'full';

type PrimerContentWidth = Exclude<ContentWidth, 'small'>;

type DefaultLayoutMetadata = {
  title?: string;
  description?: string;
};

type DefaultLayoutProps = {
  children: React.ReactNode;
  metadata?: DefaultLayoutMetadata;
  contentWidth?: ContentWidth;
};

const contentWidthClasses: Partial<Record<ContentWidth, string>> = {
  small: styles.smallContent,
};

export default function DefaultLayout({
  children,
  metadata = {},
  contentWidth,
}: DefaultLayoutProps) {
  const navigate = useNavigate();

  const extraContentClassName = contentWidth
    ? contentWidthClasses[contentWidth]
    : undefined;

  const primerWidth: PrimerContentWidth | undefined =
    contentWidth === 'small' ? undefined : contentWidth;

  const title = metadata.title
    ? `${metadata.title} · Gerenciador de Empresas`
    : 'Gerenciador de Empresas';

  return (
    <>
      <Helmet>
        <title>{title}</title>

        {metadata.description && (
          <meta name="description" content={metadata.description} />
        )}
      </Helmet>

      <Header>
        <Header.Item full>
          <Header.Link
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigate('/');
            }}
          >
            <OrganizationIcon
              size={30}
              verticalAlign="middle"
              className={styles.organizationIcon}
            />
            <Text size="large">Gerenciador de Empresas</Text>
          </Header.Link>
        </Header.Item>

        <Header.Item>
          <Header.Link
            href="/empresas"
            onClick={(event) => {
              event.preventDefault();
              navigate('/empresas');
            }}
          >
            Empresas
          </Header.Link>
        </Header.Item>

        <Header.Item>
          <Header.Link
            href="/empresas/cadastrar"
            onClick={(event) => {
              event.preventDefault();
              navigate('/empresas/cadastrar');
            }}
          >
            Cadastrar
          </Header.Link>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayout.Content
          width={primerWidth}
          className={extraContentClassName}
        >
          {children}
        </PageLayout.Content>

        <PageLayout.Footer className={styles.footerText} divider="line">
          <Text>© {new Date().getFullYear()} Gerenciador de Empresas</Text>
        </PageLayout.Footer>
      </PageLayout>
    </>
  );
}
