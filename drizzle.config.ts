import type { Config } from 'drizzle-kit';
import { settings } from './src/config/settings';

export default {
  schema: './src/db/schema/*.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: settings.DATABASE_URL,
  },
} satisfies Config;
