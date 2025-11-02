import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/database/products';
import { db } from '@/db';
import { products, inventory } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products, success: true });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      name,
      slug,
      description,
      longDescription,
      categoryId,
      brand,
      origin,
      type,
      images,
      status,
      isFeatured,
      availableSizes,
      pricesPerKg,
      seoTitle,
      seoDescription,
    } = body;

    // Validaciones
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son obligatorios' },
        { status: 400 }
      );
    }

    if (!availableSizes || availableSizes.length === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos un tamaño' },
        { status: 400 }
      );
    }

    // Verificar que el slug no exista
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (existingProduct.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe un producto con este slug' },
        { status: 400 }
      );
    }

    // Crear el producto
    const newProduct = await db.insert(products).values({
      name,
      slug,
      description,
      longDescription,
      categoryId,
      brand,
      origin,
      type,
      images,
      status: status || 'draft',
      isFeatured: isFeatured || false,
      availableSizes,
      pricesPerKg,
      seoTitle,
      seoDescription,
    }).returning();

    const productId = newProduct[0].id;

    // Crear registro de inventario inicial
    await db.insert(inventory).values({
      productId,
      stockKg: '0',
      reservedKg: '0',
      availableKg: '0',
      minStockKg: '5',
      maxStockKg: '100',
      location: 'principal',
    });

    return NextResponse.json({
      success: true,
      product: {
        id: productId,
        name,
        slug,
      }
    });

  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear el producto' },
      { status: 500 }
    );
  }
}