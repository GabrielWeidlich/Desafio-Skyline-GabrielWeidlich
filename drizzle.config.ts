import type { Config } from 'drizzle-kit';
import { settings } from './config/settings';

export default {
  schema: './db/schema/*.ts',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: settings.DATABASE_URL,
  },
} satisfies Config;
