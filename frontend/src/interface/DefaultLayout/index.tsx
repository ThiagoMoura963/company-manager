import { PageLayout, Header, Text } from '@primer/react';
import { OrganizationIcon } from '@primer/octicons-react';
import React, { useEffect } from 'react';
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
  const extraContentClassName = contentWidth
    ? contentWidthClasses[contentWidth]
    : undefined;

  const primerWidth: PrimerContentWidth | undefined =
    contentWidth === 'small' ? undefined : contentWidth;

  useEffect(() => {
    document.title = metadata.title
      ? `${metadata.title} · Gerenciador de Empresas`
      : 'Gerenciador de Empresas';

    if (metadata.description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', metadata.description);
    }
  }, [metadata.title, metadata.description]);

  return (
    <>
      <Header>
        <Header.Item full>
          <Header.Link href="/">
            <OrganizationIcon
              size={30}
              verticalAlign="middle"
              className={styles.organizationIcon}
            />
            <Text size="large">Gerenciador de Empresas</Text>
          </Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link href="/empresas/cadastrar">Cadastrar</Header.Link>
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
