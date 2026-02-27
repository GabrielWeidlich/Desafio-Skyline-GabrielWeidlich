import { z } from 'zod';

// Environment variables schema validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url({
    message: 'DATABASE_URL must be a valid URL string'
  }),
  JWT_SECRET: z.string().min(32, {
    message: 'JWT_SECRET must be at least 32 characters long'
  }).optional(),
  CORS_ORIGIN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Type inference from schema
type Env = z.infer<typeof envSchema>;

// Validate environment variables
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === 'invalid_type')
        .map(err => `- ${err.path.join('.')}: ${err.message}`)
        .join('\n');
      
      const invalidVars = error.errors
        .filter(err => err.code !== 'invalid_type')
        .map(err => `- ${err.path.join('.')}: ${err.message}`)
        .join('\n');

      let errorMessage = '❌ Invalid environment variables:\n\n';
      
      if (missingVars) {
        errorMessage += 'Missing required variables:\n' + missingVars + '\n\n';
      }
      
      if (invalidVars) {
        errorMessage += 'Invalid variable values:\n' + invalidVars + '\n\n';
      }

      errorMessage += 'Please check your .env file and ensure all required variables are set correctly.';
      
      throw new Error(errorMessage);
    }
    throw error;
  }
}

// Export validated and immutable configuration
export const settings = Object.freeze(validateEnv());

// Export individual settings for convenience
export const {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  CORS_ORIGIN,
  LOG_LEVEL,
} = settings;

// Export type for use in other modules
export type Settings = Env;
