import dotenv from 'dotenv';

dotenv.config(); // carga .env desde la raiz (donde está package.json)

function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 3000),

  SUPABASE_URL: must('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: must('SUPABASE_SERVICE_ROLE_KEY'),

  JWT_SECRET: must('JWT_SECRET'),
  JWT_REFRESH_SECRET: must('JWT_REFRESH_SECRET'),

  TZ: process.env.TZ || 'America/Argentina/Buenos_Aires',
};
