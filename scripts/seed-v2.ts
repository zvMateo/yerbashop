import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seedDatabase() {
  console.log('🌱 Iniciando seeding con MODELO CORRECTO (Stock en KG)...\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL no está configurado');
    process.exit(1);
  }

  const sql = postgres(databaseUrl);

  try {
    console.log('📂 Creando categorías...');
    
    const categories = await sql`
      INSERT INTO categories (name, slug, description, image, sort_order)
      VALUES 
        ('Yerba Mate', 'yerba-mate', 'Yerba mate agroecológica de la mejor calidad', '/images/categories/yerba-mate.jpg', 1),
        ('Yuyos', 'yuyos', 'Yuyos medicinales y aromáticos para el mate', '/images/categories/yuyos.jpg', 2),
        ('Mates', 'mates', 'Mates artesanales y tradicionales', '/images/categories/mates.jpg', 3),
        ('Yerberas', 'yerberas', 'Yerberas y accesorios para el mate', '/images/categories/yerberas.jpg', 4)
      RETURNING id, name
    `;
    
    console.log(`✅ ${categories.length} categorías creadas`);

    const yerbaCat = categories.find((c: any) => c.name === 'Yerba Mate');
    const yuyosCat = categories.find((c: any) => c.name === 'Yuyos');

    console.log('\n🫖 Creando productos con PRECIOS POR TAMAÑO...');

    // Crear productos con precios por tamaño
    const productsData = await sql`
      INSERT INTO products (
        name, slug, description, long_description, category_id, 
        brand, origin, type, images, status, is_featured, tags,
        prices_per_kg, available_sizes,
        seo_title, seo_description
      )
      VALUES 
        (
          'Yerba Despalada Fina',
          'yerba-despalada-fina',
          'Yerba mate agroecológica despalada fina, suave y equilibrada',
          'Yerba mate agroecológica despalada fina, cultivada de forma sostenible. Su sabor suave y equilibrado la hace perfecta para todo el día.',
          ${yerbaCat!.id},
          'Agroecológica',
          'Misiones',
          'Despalada Fina',
          '["images/products/yerba-despalada-1.jpg"]'::jsonb,
          'active',
          true,
          '["agroecologica","organica","despalada","fina"]'::jsonb,
          '{"0.5": 1200, "1": 2200, "2": 4200, "3": 6000}'::jsonb,
          '[0.5, 1, 2, 3]'::jsonb,
          'Yerba Despalada Fina Agroecológica',
          'Yerba mate despalada fina agroecológica de Misiones'
        ),
        (
          'Yerba Con Palo',
          'yerba-con-palo',
          'Yerba mate agroecológica con palo, sabor tradicional',
          'Yerba mate agroecológica con palo, equilibrio perfecto entre hoja y palo para un mate tradicional.',
          ${yerbaCat!.id},
          'Agroecológica',
          'Misiones',
          'Con Palo',
          '["images/products/yerba-palo-1.jpg"]'::jsonb,
          'active',
          true,
          '["agroecologica","organica","palo","tradicional"]'::jsonb,
          '{"0.5": 1100, "1": 2000, "2": 3800, "3": 5500}'::jsonb,
          '[0.5, 1, 2, 3]'::jsonb,
          'Yerba Con Palo Agroecológica',
          'Yerba mate con palo agroecológica de Misiones'
        ),
        (
          'Yerba Barbacuá',
          'yerba-barbacua',
          'Yerba mate agroecológica barbacuá, sabor intenso',
          'Yerba mate barbacuá secada a la antigua, con leña. Sabor intenso y ahumado característico.',
          ${yerbaCat!.id},
          'Agroecológica',
          'Corrientes',
          'Barbacuá',
          '["images/products/yerba-barbacua-1.jpg"]'::jsonb,
          'active',
          false,
          '["agroecologica","barbacua","intenso","ahumado"]'::jsonb,
          '{"0.5": 1250, "1": 2300, "2": 4400, "3": 6300}'::jsonb,
          '[0.5, 1, 2, 3]'::jsonb,
          'Yerba Barbacuá Agroecológica',
          'Yerba mate barbacuá agroecológica'
        ),
        (
          'Yuyo Cedrón',
          'yuyo-cedron',
          'Yuyo cedrón para agregar al mate',
          'Yuyo cedrón natural, perfecto para agregar al mate y darle un sabor cítrico y refrescante.',
          ${yuyosCat!.id},
          'Natural',
          'Argentina',
          'Medicinal',
          '["images/products/yuyo-cedron-1.jpg"]'::jsonb,
          'active',
          false,
          '["medicinal","citrico","natural"]'::jsonb,
          '{"0.1": 800, "0.2": 1500}'::jsonb,
          '[0.1, 0.2]'::jsonb,
          'Yuyo Cedrón Natural para Mate',
          'Yuyo cedrón natural para agregar al mate'
        )
      RETURNING id, name
    `;

    console.log(`✅ ${productsData.length} productos creados con precios por tamaño`);

    console.log('\n📊 Creando inventario EN KILOGRAMOS...');

    // Crear inventario en KG para cada producto
    const yerbaDespalada = productsData.find((p: any) => p.name === 'Yerba Despalada Fina');
    const yerbaConPalo = productsData.find((p: any) => p.name === 'Yerba Con Palo');
    const yerbaBarbacua = productsData.find((p: any) => p.name === 'Yerba Barbacuá');
    const yuyoCedron = productsData.find((p: any) => p.name === 'Yuyo Cedrón');

    await sql`
      INSERT INTO inventory (product_id, stock_kg, reserved_kg, available_kg, min_stock_kg, max_stock_kg, cost_per_kg, location, notes)
      VALUES 
        (${yerbaDespalada!.id}, 20.0, 0.0, 20.0, 5.0, 100.0, 1400, 'principal', 'Compró 2 bolsas de 10kg'),
        (${yerbaConPalo!.id}, 30.0, 0.0, 30.0, 5.0, 100.0, 1300, 'principal', 'Compró 3 bolsas de 10kg'),
        (${yerbaBarbacua!.id}, 10.0, 0.0, 10.0, 3.0, 50.0, 1500, 'principal', 'Compró 1 bolsa de 10kg'),
        (${yuyoCedron!.id}, 2.0, 0.0, 2.0, 0.5, 10.0, 400, 'principal', 'Stock de yuyos')
    `;

    console.log('✅ Inventario creado en KILOGRAMOS');

    console.log('\n🎉 ¡Seeding completado exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('   - 4 categorías');
    console.log('   - 4 productos (variedades de yerba)');
    console.log('   - Stock total: 62 kg de productos');
    console.log('   - Cada producto tiene precios por tamaño de empaquetado');
    console.log('\n💡 Productos creados:');
    console.log('   - Yerba Despalada Fina: 20 kg');
    console.log('   - Yerba Con Palo: 30 kg');
    console.log('   - Yerba Barbacuá: 10 kg');
    console.log('   - Yuyo Cedrón: 2 kg');
    console.log('\n📦 Tamaños disponibles: 0.5kg, 1kg, 2kg, 3kg');

    await sql.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante el seeding:', error);
    await sql.end();
    process.exit(1);
  }
}

seedDatabase();

