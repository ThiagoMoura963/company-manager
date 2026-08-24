# Gerenciador de Empresas

Aplicação full stack para cadastro, consulta, edição e exclusão de empresas, com envio automático de e-mail a cada novo cadastro.

---

## Funcionalidades

- Cadastro de empresas com validação de CNPJ
- Listagem com busca por nome, CNPJ, nome fantasia ou endereço
- Edição e exclusão de empresas
- Notificação por e-mail automática após cada novo cadastro
- Tratamento centralizado de erros, com respostas padronizadas para o frontend

---

## Tecnologias

| Camada | Tecnologias |
|---|---|
| **Frontend** | React, SWR, GitHub Primer (Design System) |
| **Backend** | NestJS, PostgreSQL, `pg` (queries puras, sem ORM) |
| **E-mail** | Nodemailer + Mailcatcher (SMTP local) |
| **Banco de Dados** | PostgreSQL + `node-pg-migrate` |
| **Infraestrutura** | Docker |
| **Testes** | Jest (testes de integração) |
| **CI/CD** | GitHub Actions (lint, testes e padronização de commits) |

---

## Como Rodar o Projeto

Pré-requisitos: **Node.js** e **Docker** instalados.

1. **Instalar dependências**
   ```bash
   # backend
   npm install

   # frontend
   npm install
   ```

2. **Subir os containers** (banco de dados e Mailcatcher)
   ```bash
    npm run services:up"
   ```

3. **Rodar as migrações**
   ```bash
   npm run migrations:up
   ```

4. **Iniciar o servidor (backend)**
   ```bash
   npm run start
   ```
5. **Iniciar o servidor (frontend)**
   ```bash
   npm run dev
   ```

6. **Rodar os testes**
   ```bash
   npm test
   ```
