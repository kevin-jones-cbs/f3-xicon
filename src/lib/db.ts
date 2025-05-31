import { Pool } from 'pg';

const requiredEnvVars = ['POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'] as const;

function validateEnv() {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (pool) return pool;

  validateEnv();

  const isGcp = process.env.INSTANCE_CONNECTION_NAME !== undefined;

  pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: isGcp
      ? `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
      : process.env.POSTGRES_HOST,
    port: isGcp ? undefined : parseInt(process.env.POSTGRES_PORT || '5432'),
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  return pool;
}
