import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkData() {
  console.log('🔍 Verificando datos en la base de datos...\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL no está configurado');
    process.exit(1);
  }

  const sql = postgres(databaseUrl);

  try {
    // Contar categorías
    const categories = await sql`SELECT COUNT(*) as count FROM categories`;
    console.log(`📂 Categorías: ${categories[0].count}`);

    // Listar categorías
    const catList = await sql`SELECT name, slug FROM categories ORDER BY sort_order`;
    catList.forEach((cat: any) => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    // Contar productos
    const products = await sql`SELECT COUNT(*) as count FROM products`;
    console.log(`\n🫖 Productos: ${products[0].count}`);

    // Listar productos con categorías
    const prodList = await sql`
      SELECT p.name, p.brand, p.status, c.name as category 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name
    `;
    prodList.forEach((prod: any) => {
      console.log(`   - ${prod.name} (${prod.brand}) - ${prod.category} [${prod.status}]`);
    });

    // Inventario (nuevo modelo: stock en KG)
    console.log('\n📊 Inventario (Stock en KG):');
    const inventoryList = await sql`
      SELECT p.name as product, p.brand, i.stock_kg, i.available_kg, i.reserved_kg, i.min_stock_kg, i.cost_per_kg
      FROM inventory i
      LEFT JOIN products p ON i.product_id = p.id
      ORDER BY p.name
    `;
    
    inventoryList.forEach((inv: any) => {
      const stockKg = parseFloat(inv.stock_kg || 0);
      const minKg = parseFloat(inv.min_stock_kg || 0);
      const status = stockKg === 0 ? '❌' : stockKg <= minKg ? '⚠️' : '✅';
      console.log(`   ${status} ${inv.product} (${inv.brand}): ${stockKg}kg (disponible: ${inv.available_kg}kg)`);
    });

    // Estadísticas de inventario
    const totalStockKg = await sql`SELECT SUM(CAST(stock_kg AS DECIMAL)) as total FROM inventory`;
    const totalValue = await sql`
      SELECT SUM(CAST(stock_kg AS DECIMAL) * CAST(cost_per_kg AS DECIMAL)) as value 
      FROM inventory
    `;

    console.log('\n💰 Resumen de inventario:');
    console.log(`   - Total kilogramos en stock: ${parseFloat(totalStockKg[0].total || 0).toFixed(1)} kg`);
    console.log(`   - Valor total del inventario: $${parseFloat(totalValue[0].value || 0).toFixed(2)}`);

    console.log('\n✅ ¡Base de datos poblada correctamente!');
    
    await sql.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    await sql.end();
    process.exit(1);
  }
}

checkData();
