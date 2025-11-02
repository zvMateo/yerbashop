import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seedDatabase() {
  console.log('🌱 Iniciando seeding de la base de datos...\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL no está configurado');
    process.exit(1);
  }

  const sql = postgres(databaseUrl);

  try {
    console.log('📂 Creando categorías...');
    
    // Crear categorías
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

    // Obtener IDs de categorías
    const yerbaCat = categories.find((c: any) => c.name === 'Yerba Mate');
    const yuyosCat = categories.find((c: any) => c.name === 'Yuyos');

    console.log('\n🫖 Creando productos...');

    // Crear productos
    const productsData = await sql`
      INSERT INTO products (name, slug, description, long_description, category_id, brand, origin, type, images, status, is_featured, tags, seo_title, seo_description)
      VALUES 
        (
          'Yerba Xanaes',
          'yerba-xanaes',
          'Yerba mate agroecológica Xanaes, suave y equilibrada',
          'Yerba mate agroecológica de la marca Xanaes, cultivada de forma sostenible en Misiones. Su sabor suave y equilibrado la hace perfecta para todo el día.',
          ${yerbaCat!.id},
          'Xanaes',
          'Misiones',
          'Agroecológica',
          '["images/products/yerba-xanaes-1.jpg","images/products/yerba-xanaes-2.jpg"]'::jsonb,
          'active',
          true,
          '["agroecologica","organica","misiones","suave"]'::jsonb,
          'Yerba Xanaes Agroecológica - La Mejor Yerba Mate',
          'Descubre la yerba mate Xanaes agroecológica, cultivada de forma sostenible en Misiones.'
        ),
        (
          'Yerba Amanda',
          'yerba-amanda',
          'Yerba mate Amanda, fuerte y tradicional',
          'Yerba mate Amanda, una marca tradicional argentina conocida por su sabor fuerte y característico.',
          ${yerbaCat!.id},
          'Amanda',
          'Corrientes',
          'Tradicional',
          '["images/products/yerba-amanda-1.jpg"]'::jsonb,
          'active',
          true,
          '["tradicional","fuerte","corrientes"]'::jsonb,
          'Yerba Amanda Tradicional - Sabor Intenso',
          'Yerba mate Amanda, la marca tradicional argentina con sabor fuerte.'
        ),
        (
          'Yerba Playadito',
          'yerba-playadito',
          'Yerba mate Playadito, suave y dulce',
          'Yerba mate Playadito, conocida por su sabor suave y dulce. Ideal para quienes prefieren un mate más suave.',
          ${yerbaCat!.id},
          'Playadito',
          'Misiones',
          'Suave',
          '["images/products/yerba-playadito-1.jpg"]'::jsonb,
          'active',
          false,
          '["suave","dulce","misiones"]'::jsonb,
          'Yerba Playadito Suave - Sabor Dulce',
          'Yerba mate Playadito con sabor suave y dulce.'
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
          'Yuyo Cedrón Natural para Mate',
          'Yuyo cedrón natural para agregar al mate.'
        )
      RETURNING id, name
    `;

    console.log(`✅ ${productsData.length} productos creados`);

    // Obtener IDs de productos
    const yerbaXanaes = productsData.find((p: any) => p.name === 'Yerba Xanaes');
    const yerbaAmanda = productsData.find((p: any) => p.name === 'Yerba Amanda');
    const yerbaPlayadito = productsData.find((p: any) => p.name === 'Yerba Playadito');
    const yuyoCedron = productsData.find((p: any) => p.name === 'Yuyo Cedrón');

    console.log('\n📦 Creando variantes de productos...');

    // Crear variantes para Yerba Xanaes
    const xanaesVariants = await sql`
      INSERT INTO product_variants (product_id, name, weight, unit, price, cost, sku, sort_order)
      VALUES 
        (${yerbaXanaes!.id}, '0.5kg', 0.5, 'kg', 1200, 800, 'XAN-05KG', 0),
        (${yerbaXanaes!.id}, '1kg', 1.0, 'kg', 2200, 1400, 'XAN-1KG', 1),
        (${yerbaXanaes!.id}, '2kg', 2.0, 'kg', 4200, 2600, 'XAN-2KG', 2),
        (${yerbaXanaes!.id}, '3kg', 3.0, 'kg', 6000, 3600, 'XAN-3KG', 3)
      RETURNING id
    `;

    // Crear variantes para Yerba Amanda
    const amandaVariants = await sql`
      INSERT INTO product_variants (product_id, name, weight, unit, price, cost, sku, sort_order)
      VALUES 
        (${yerbaAmanda!.id}, '0.5kg', 0.5, 'kg', 1100, 750, 'AMA-05KG', 0),
        (${yerbaAmanda!.id}, '1kg', 1.0, 'kg', 2000, 1300, 'AMA-1KG', 1),
        (${yerbaAmanda!.id}, '2kg', 2.0, 'kg', 3800, 2400, 'AMA-2KG', 2),
        (${yerbaAmanda!.id}, '3kg', 3.0, 'kg', 5500, 3300, 'AMA-3KG', 3)
      RETURNING id
    `;

    // Crear variantes para Yerba Playadito
    const playaditoVariants = await sql`
      INSERT INTO product_variants (product_id, name, weight, unit, price, cost, sku, sort_order)
      VALUES 
        (${yerbaPlayadito!.id}, '0.5kg', 0.5, 'kg', 1150, 780, 'PLA-05KG', 0),
        (${yerbaPlayadito!.id}, '1kg', 1.0, 'kg', 2100, 1350, 'PLA-1KG', 1),
        (${yerbaPlayadito!.id}, '2kg', 2.0, 'kg', 4000, 2500, 'PLA-2KG', 2)
      RETURNING id
    `;

    // Crear variante para Yuyo Cedrón
    const cedronVariants = await sql`
      INSERT INTO product_variants (product_id, name, weight, unit, price, cost, sku, sort_order)
      VALUES 
        (${yuyoCedron!.id}, '100g', 0.1, 'kg', 800, 400, 'CED-100G', 0)
      RETURNING id
    `;

    const totalVariants = xanaesVariants.length + amandaVariants.length + playaditoVariants.length + cedronVariants.length;
    console.log(`✅ ${totalVariants} variantes creadas`);

    console.log('\n📊 Creando inventario inicial...');

    // Crear inventario para todas las variantes
    const allVariants = [...xanaesVariants, ...amandaVariants, ...playaditoVariants, ...cedronVariants];
    
    for (const variant of allVariants) {
      await sql`
        INSERT INTO inventory (variant_id, stock_quantity, reserved_quantity, available_quantity, min_stock_level, max_stock_level, location, notes)
        VALUES (${variant.id}, 50, 0, 50, 10, 200, 'principal', 'Stock inicial')
      `;
    }

    console.log(`✅ Inventario creado para ${allVariants.length} variantes`);

    console.log('\n🎉 ¡Seeding completado exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   - 4 categorías`);
    console.log(`   - 4 productos`);
    console.log(`   - ${totalVariants} variantes`);
    console.log(`   - ${allVariants.length} registros de inventario`);

    await sql.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante el seeding:', error);
    await sql.end();
    process.exit(1);
  }
}

seedDatabase();
