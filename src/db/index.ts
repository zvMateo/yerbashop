import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
let db: PostgresJsDatabase<typeof schema> | null = null;

if (connectionString) {
  try {
    db = drizzle(postgres(connectionString), { schema });
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
}

export { db };

