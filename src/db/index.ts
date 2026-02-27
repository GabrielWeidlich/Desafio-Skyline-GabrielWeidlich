import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { settings } from '../config/settings';
import * as schema from './schema';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: settings.DATABASE_URL,
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Export schema for use in services
export { schema };

// Export types
export type { Task, NewTask, Priority } from './schema/tasks';
