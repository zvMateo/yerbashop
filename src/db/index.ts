import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Configuración de conexión a Supabase
const connectionString = process.env.DATABASE_URL!;

// Crear conexión PostgreSQL
const client = postgres(connectionString, { prepare: false });

// Crear instancia de Drizzle con el esquema
export const db = drizzle(client, { schema });

// Exportar el esquema para usar en otros archivos
export * from './schema';

