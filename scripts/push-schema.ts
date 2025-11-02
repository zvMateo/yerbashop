import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';
import * as schema from '../src/db/schema';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function pushSchema() {
  console.log('🚀 Aplicando esquema a la base de datos...\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL no está configurado en .env.local');
    process.exit(1);
  }

  console.log('📝 DATABASE_URL encontrado');
  console.log('🔗 Conectando a:', databaseUrl.replace(/:[^:@]+@/, ':****@'));

  try {
    const sql = postgres(databaseUrl, { max: 1 });
    const db = drizzle(sql, { schema });

    console.log('\n✅ Conexión establecida');
    console.log('📊 Las tablas ya fueron creadas con las migraciones anteriores');
    console.log('\n🎯 Para poblar con datos de ejemplo, ejecuta: pnpm run db:seed');

    await sql.end();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERROR:');
    console.error(error);
    process.exit(1);
  }
}

pushSchema();
