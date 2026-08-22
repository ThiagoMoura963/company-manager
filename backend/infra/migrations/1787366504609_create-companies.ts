import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('companies', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },

    name: {
      type: 'varchar(255)',
      notNull: true,
    },

    cnpj: {
      type: 'varchar(14)',
      notNull: true,
      unique: true,
    },

    trade_name: {
      type: 'varchar(255)',
      notNull: true,
    },

    address: {
      type: 'text',
      notNull: true,
    },

    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
}

export const down = false;
