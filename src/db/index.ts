import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

export const db: PostgresJsDatabase<typeof schema> = connectionString
  ? drizzle(postgres(connectionString), { schema })
  : ({} as PostgresJsDatabase<typeof schema>);
