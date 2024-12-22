// import { Pool } from "pg";
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import 'dotenv/config';

import { createClient } from '@libsql/client';
import env from '@/env';
import * as schema from './schema';

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// const db = drizzle(pool);

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, {
  schema,
});

async function main() {
  console.log('migration started...');
  // await migrate(db, { migrationsFolder: "drizzle" });
  await migrate(db, { migrationsFolder: 'src/db/migrations' });
  console.log('migration ended...');
  process.exit(0);
}

main().catch(err => {
  console.log(err);
  process.exit(0);
});
