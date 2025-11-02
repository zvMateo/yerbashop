import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runMigrations() {
  console.log('🚀 Ejecutando migraciones...\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL no está configurado en .env.local');
    process.exit(1);
  }

  console.log('📝 DATABASE_URL encontrado');
  console.log('🔗 Conectando a la base de datos...');

  try {
    // Crear conexión para migraciones
    const migrationClient = postgres(databaseUrl, { max: 1 });
    const db = drizzle(migrationClient);

    console.log('📦 Aplicando migraciones...');
    
    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('✅ ¡Migraciones ejecutadas exitosamente!');
    
    // Verificar tablas creadas
    const tables = await migrationClient`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('\n📋 Tablas creadas:');
    tables.forEach((table: any) => {
      console.log(`   ✓ ${table.table_name}`);
    });

    await migrationClient.end();
    
    console.log('\n🎉 ¡Base de datos lista para usar!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERROR AL EJECUTAR MIGRACIONES:');
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
