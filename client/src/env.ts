import { z } from 'zod';

const EnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:9999'),
  VITE_ENABLE_MSW: z.enum(['true', 'false']).default('false'),
});

export type Env = z.infer<typeof EnvSchema>;

// Validate environment variables
const { success, data: env, error } = EnvSchema.safeParse(import.meta.env);

if (!success) {
  console.error('❌ Invalid client environment variables:');
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  throw new Error('Invalid environment variables');
}

export default env as Env;
