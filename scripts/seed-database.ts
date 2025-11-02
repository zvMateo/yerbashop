import { db } from '../src/db';
import { categories, products, productVariants, inventory } from '../src/db/schema';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seedDatabase() {
  console.log('🌱 Iniciando seeding de la base de datos...');

  try {
    // ========================================
    // 1. CREAR CATEGORÍAS
    // ========================================
    console.log('📂 Creando categorías...');
    
    const yerbaCategory = await db.insert(categories).values({
      name: 'Yerba Mate',
      slug: 'yerba-mate',
      description: 'Yerba mate agroecológica de la mejor calidad',
      image: '/images/categories/yerba-mate.jpg',
      sortOrder: 1,
    }).returning();

    const yuyosCategory = await db.insert(categories).values({
      name: 'Yuyos',
      slug: 'yuyos',
      description: 'Yuyos medicinales y aromáticos para el mate',
      image: '/images/categories/yuyos.jpg',
      sortOrder: 2,
    }).returning();

    const matesCategory = await db.insert(categories).values({
      name: 'Mates',
      slug: 'mates',
      description: 'Mates artesanales y tradicionales',
      image: '/images/categories/mates.jpg',
      sortOrder: 3,
    }).returning();

    const yerberasCategory = await db.insert(categories).values({
      name: 'Yerberas',
      slug: 'yerberas',
      description: 'Yerberas y accesorios para el mate',
      image: '/images/categories/yerberas.jpg',
      sortOrder: 4,
    }).returning();

    console.log('✅ Categorías creadas');

    // ========================================
    // 2. CREAR PRODUCTOS
    // ========================================
    console.log('🫖 Creando productos...');

    // Yerba Xanaes
    const yerbaXanaes = await db.insert(products).values({
      name: 'Yerba Xanaes',
      slug: 'yerba-xanaes',
      description: 'Yerba mate agroecológica Xanaes, suave y equilibrada',
      longDescription: 'Yerba mate agroecológica de la marca Xanaes, cultivada de forma sostenible en Misiones. Su sabor suave y equilibrado la hace perfecta para todo el día.',
      categoryId: yerbaCategory[0].id,
      brand: 'Xanaes',
      origin: 'Misiones',
      type: 'Agroecológica',
      images: ['/images/products/yerba-xanaes-1.jpg', '/images/products/yerba-xanaes-2.jpg'],
      isActive: 'active',
      isFeatured: true,
      tags: ['agroecologica', 'organica', 'misiones', 'suave'],
      seoTitle: 'Yerba Xanaes Agroecológica - La Mejor Yerba Mate',
      seoDescription: 'Descubre la yerba mate Xanaes agroecológica, cultivada de forma sostenible en Misiones. Sabor suave y equilibrado.',
    }).returning();

    // Yerba Amanda
    const yerbaAmanda = await db.insert(products).values({
      name: 'Yerba Amanda',
      slug: 'yerba-amanda',
      description: 'Yerba mate Amanda, fuerte y tradicional',
      longDescription: 'Yerba mate Amanda, una marca tradicional argentina conocida por su sabor fuerte y característico. Perfecta para los amantes del mate intenso.',
      categoryId: yerbaCategory[0].id,
      brand: 'Amanda',
      origin: 'Corrientes',
      type: 'Tradicional',
      images: ['/images/products/yerba-amanda-1.jpg', '/images/products/yerba-amanda-2.jpg'],
      isActive: 'active',
      isFeatured: true,
      tags: ['tradicional', 'fuerte', 'corrientes', 'clasica'],
      seoTitle: 'Yerba Amanda Tradicional - Sabor Intenso',
      seoDescription: 'Yerba mate Amanda, la marca tradicional argentina con sabor fuerte y característico.',
    }).returning();

    // Yerba Playadito
    const yerbaPlayadito = await db.insert(products).values({
      name: 'Yerba Playadito',
      slug: 'yerba-playadito',
      description: 'Yerba mate Playadito, suave y dulce',
      longDescription: 'Yerba mate Playadito, conocida por su sabor suave y dulce. Ideal para quienes prefieren un mate más suave y menos amargo.',
      categoryId: yerbaCategory[0].id,
      brand: 'Playadito',
      origin: 'Misiones',
      type: 'Suave',
      images: ['/images/products/yerba-playadito-1.jpg'],
      isActive: 'active',
      isFeatured: false,
      tags: ['suave', 'dulce', 'misiones', 'playadito'],
      seoTitle: 'Yerba Playadito Suave - Sabor Dulce',
      seoDescription: 'Yerba mate Playadito con sabor suave y dulce, perfecta para un mate menos amargo.',
    }).returning();

    // Yuyo Cedrón
    const yuyoCedron = await db.insert(products).values({
      name: 'Yuyo Cedrón',
      slug: 'yuyo-cedron',
      description: 'Yuyo cedrón para agregar al mate',
      longDescription: 'Yuyo cedrón natural, perfecto para agregar al mate y darle un sabor cítrico y refrescante. Ayuda a la digestión.',
      categoryId: yuyosCategory[0].id,
      brand: 'Natural',
      origin: 'Argentina',
      type: 'Medicinal',
      images: ['/images/products/yuyo-cedron-1.jpg'],
      isActive: 'active',
      isFeatured: false,
      tags: ['medicinal', 'citrico', 'digestivo', 'natural'],
      seoTitle: 'Yuyo Cedrón Natural para Mate',
      seoDescription: 'Yuyo cedrón natural para agregar al mate, sabor cítrico y propiedades digestivas.',
    }).returning();

    console.log('✅ Productos creados');

    // ========================================
    // 3. CREAR VARIANTES DE PRODUCTOS
    // ========================================
    console.log('📦 Creando variantes de productos...');

    // Variantes para Yerba Xanaes
    const xanaesVariants = [
      { name: '0.5kg', weight: 0.5, price: 1200, cost: 800, sku: 'XAN-05KG' },
      { name: '1kg', weight: 1.0, price: 2200, cost: 1400, sku: 'XAN-1KG' },
      { name: '2kg', weight: 2.0, price: 4200, cost: 2600, sku: 'XAN-2KG' },
      { name: '3kg', weight: 3.0, price: 6000, cost: 3600, sku: 'XAN-3KG' },
    ];

    const xanaesVariantsCreated = [];
    for (const variant of xanaesVariants) {
      const created = await db.insert(productVariants).values({
        productId: yerbaXanaes[0].id,
        name: variant.name,
        weight: variant.weight.toString(),
        unit: 'kg',
        price: variant.price.toString(),
        cost: variant.cost.toString(),
        sku: variant.sku,
        sortOrder: xanaesVariants.indexOf(variant),
      }).returning();
      xanaesVariantsCreated.push(created[0]);
    }

    // Variantes para Yerba Amanda
    const amandaVariants = [
      { name: '0.5kg', weight: 0.5, price: 1100, cost: 750, sku: 'AMA-05KG' },
      { name: '1kg', weight: 1.0, price: 2000, cost: 1300, sku: 'AMA-1KG' },
      { name: '2kg', weight: 2.0, price: 3800, cost: 2400, sku: 'AMA-2KG' },
      { name: '3kg', weight: 3.0, price: 5500, cost: 3300, sku: 'AMA-3KG' },
    ];

    const amandaVariantsCreated = [];
    for (const variant of amandaVariants) {
      const created = await db.insert(productVariants).values({
        productId: yerbaAmanda[0].id,
        name: variant.name,
        weight: variant.weight.toString(),
        unit: 'kg',
        price: variant.price.toString(),
        cost: variant.cost.toString(),
        sku: variant.sku,
        sortOrder: amandaVariants.indexOf(variant),
      }).returning();
      amandaVariantsCreated.push(created[0]);
    }

    // Variantes para Yerba Playadito
    const playaditoVariants = [
      { name: '0.5kg', weight: 0.5, price: 1150, cost: 780, sku: 'PLA-05KG' },
      { name: '1kg', weight: 1.0, price: 2100, cost: 1350, sku: 'PLA-1KG' },
      { name: '2kg', weight: 2.0, price: 4000, cost: 2500, sku: 'PLA-2KG' },
    ];

    const playaditoVariantsCreated = [];
    for (const variant of playaditoVariants) {
      const created = await db.insert(productVariants).values({
        productId: yerbaPlayadito[0].id,
        name: variant.name,
        weight: variant.weight.toString(),
        unit: 'kg',
        price: variant.price.toString(),
        cost: variant.cost.toString(),
        sku: variant.sku,
        sortOrder: playaditoVariants.indexOf(variant),
      }).returning();
      playaditoVariantsCreated.push(created[0]);
    }

    // Variante para Yuyo Cedrón (solo 100g)
    const cedronVariant = await db.insert(productVariants).values({
      productId: yuyoCedron[0].id,
      name: '100g',
      weight: 0.1,
      unit: 'kg',
      price: 800,
      cost: 400,
      sku: 'CED-100G',
      sortOrder: 0,
    }).returning();

    console.log('✅ Variantes creadas');

    // ========================================
    // 4. CREAR INVENTARIO INICIAL
    // ========================================
    console.log('📊 Creando inventario inicial...');

    // Inventario para Yerba Xanaes
    for (const variant of xanaesVariantsCreated) {
      await db.insert(inventory).values({
        variantId: variant.id,
        stockQuantity: 50, // Stock inicial de 50 unidades
        reservedQuantity: 0,
        availableQuantity: 50,
        minStockLevel: 10,
        maxStockLevel: 200,
        location: 'principal',
        notes: 'Stock inicial',
      });
    }

    // Inventario para Yerba Amanda
    for (const variant of amandaVariantsCreated) {
      await db.insert(inventory).values({
        variantId: variant.id,
        stockQuantity: 30,
        reservedQuantity: 0,
        availableQuantity: 30,
        minStockLevel: 10,
        maxStockLevel: 150,
        location: 'principal',
        notes: 'Stock inicial',
      });
    }

    // Inventario para Yerba Playadito
    for (const variant of playaditoVariantsCreated) {
      await db.insert(inventory).values({
        variantId: variant.id,
        stockQuantity: 25,
        reservedQuantity: 0,
        availableQuantity: 25,
        minStockLevel: 5,
        maxStockLevel: 100,
        location: 'principal',
        notes: 'Stock inicial',
      });
    }

    // Inventario para Yuyo Cedrón
    await db.insert(inventory).values({
      variantId: cedronVariant[0].id,
      stockQuantity: 20,
      reservedQuantity: 0,
      availableQuantity: 20,
      minStockLevel: 5,
      maxStockLevel: 50,
      location: 'principal',
      notes: 'Stock inicial',
    });

    console.log('✅ Inventario inicial creado');

    console.log('🎉 ¡Seeding completado exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`- ${categories.length} categorías creadas`);
    console.log(`- ${products.length} productos creados`);
    console.log(`- ${xanaesVariants.length + amandaVariants.length + playaditoVariants.length + 1} variantes creadas`);
    console.log(`- Inventario inicial configurado`);

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    throw error;
  }
}

// Ejecutar el seeding
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el seeding:', error);
      process.exit(1);
    });
}

export { seedDatabase };

