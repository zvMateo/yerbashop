import { db } from '@/db';
import { products, productVariants, categories, inventory } from '@/db/schema';
import { eq, and, desc, asc, sql } from 'drizzle-orm';

// ========================================
// FUNCIONES PARA CATEGORÍAS
// ========================================

export async function getAllCategories() {
  return await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function getCategoryById(id: string) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  
  return result[0];
}

export async function getCategoryBySlug(slug: string) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  
  return result[0];
}

// ========================================
// FUNCIONES PARA PRODUCTOS
// ========================================

export async function getAllProducts() {
  return await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      categoryId: products.categoryId,
      brand: products.brand,
      origin: products.origin,
      type: products.type,
      images: products.images,
      status: products.isActive,
      isFeatured: products.isFeatured,
      tags: products.tags,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, 'active'))
    .orderBy(desc(products.isFeatured), asc(products.name));
}

export async function getProductById(id: string) {
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      longDescription: products.longDescription,
      categoryId: products.categoryId,
      brand: products.brand,
      origin: products.origin,
      type: products.type,
      images: products.images,
      status: products.isActive,
      isFeatured: products.isFeatured,
      tags: products.tags,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1);
  
  return result[0];
}

export async function getProductBySlug(slug: string) {
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      longDescription: products.longDescription,
      categoryId: products.categoryId,
      brand: products.brand,
      origin: products.origin,
      type: products.type,
      images: products.images,
      status: products.isActive,
      isFeatured: products.isFeatured,
      tags: products.tags,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  
  return result[0];
}

export async function getProductsByCategory(categorySlug: string) {
  return await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      categoryId: products.categoryId,
      brand: products.brand,
      origin: products.origin,
      type: products.type,
      images: products.images,
      status: products.isActive,
      isFeatured: products.isFeatured,
      tags: products.tags,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(categories.slug, categorySlug),
        eq(products.isActive, 'active'),
        eq(categories.isActive, true)
      )
    )
    .orderBy(desc(products.isFeatured), asc(products.name));
}

export async function getFeaturedProducts() {
  return await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      categoryId: products.categoryId,
      brand: products.brand,
      origin: products.origin,
      type: products.type,
      images: products.images,
      status: products.isActive,
      isFeatured: products.isFeatured,
      tags: products.tags,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isFeatured, true),
        eq(products.isActive, 'active'),
        eq(categories.isActive, true)
      )
    )
    .orderBy(asc(products.name));
}

// ========================================
// FUNCIONES PARA VARIANTES DE PRODUCTOS
// ========================================

export async function getProductVariants(productId: string) {
  return await db
    .select({
      id: productVariants.id,
      productId: productVariants.productId,
      name: productVariants.name,
      weight: productVariants.weight,
      unit: productVariants.unit,
      price: productVariants.price,
      cost: productVariants.cost,
      sku: productVariants.sku,
      barcode: productVariants.barcode,
      isActive: productVariants.isActive,
      sortOrder: productVariants.sortOrder,
      createdAt: productVariants.createdAt,
      updatedAt: productVariants.updatedAt,
      inventory: {
        stockQuantity: inventory.stockQuantity,
        reservedQuantity: inventory.reservedQuantity,
        availableQuantity: inventory.availableQuantity,
        minStockLevel: inventory.minStockLevel,
        maxStockLevel: inventory.maxStockLevel,
      }
    })
    .from(productVariants)
    .leftJoin(inventory, eq(productVariants.id, inventory.variantId))
    .where(
      and(
        eq(productVariants.productId, productId),
        eq(productVariants.isActive, true)
      )
    )
    .orderBy(asc(productVariants.sortOrder), asc(productVariants.weight));
}

export async function getVariantById(variantId: string) {
  const result = await db
    .select({
      id: productVariants.id,
      productId: productVariants.productId,
      name: productVariants.name,
      weight: productVariants.weight,
      unit: productVariants.unit,
      price: productVariants.price,
      cost: productVariants.cost,
      sku: productVariants.sku,
      barcode: productVariants.barcode,
      isActive: productVariants.isActive,
      sortOrder: productVariants.sortOrder,
      createdAt: productVariants.createdAt,
      updatedAt: productVariants.updatedAt,
      inventory: {
        stockQuantity: inventory.stockQuantity,
        reservedQuantity: inventory.reservedQuantity,
        availableQuantity: inventory.availableQuantity,
        minStockLevel: inventory.minStockLevel,
        maxStockLevel: inventory.maxStockLevel,
      }
    })
    .from(productVariants)
    .leftJoin(inventory, eq(productVariants.id, inventory.variantId))
    .where(eq(productVariants.id, variantId))
    .limit(1);
  
  return result[0];
}

export async function getVariantBySku(sku: string) {
  const result = await db
    .select({
      id: productVariants.id,
      productId: productVariants.productId,
      name: productVariants.name,
      weight: productVariants.weight,
      unit: productVariants.unit,
      price: productVariants.price,
      cost: productVariants.cost,
      sku: productVariants.sku,
      barcode: productVariants.barcode,
      isActive: productVariants.isActive,
      sortOrder: productVariants.sortOrder,
      createdAt: productVariants.createdAt,
      updatedAt: productVariants.updatedAt,
      inventory: {
        stockQuantity: inventory.stockQuantity,
        reservedQuantity: inventory.reservedQuantity,
        availableQuantity: inventory.availableQuantity,
        minStockLevel: inventory.minStockLevel,
        maxStockLevel: inventory.maxStockLevel,
      }
    })
    .from(productVariants)
    .leftJoin(inventory, eq(productVariants.id, inventory.variantId))
    .where(eq(productVariants.sku, sku))
    .limit(1);
  
  return result[0];
}

// ========================================
// FUNCIONES COMBINADAS (PRODUCTO + VARIANTES)
// ========================================

export async function getProductWithVariants(productId: string) {
  const product = await getProductById(productId);
  if (!product) return null;

  const variants = await getProductVariants(productId);

  return {
    ...product,
    variants,
  };
}

export async function getProductWithVariantsBySlug(slug: string) {
  const product = await getProductBySlug(slug);
  if (!product) return null;

  const variants = await getProductVariants(product.id);

  return {
    ...product,
    variants,
  };
}

// ========================================
// FUNCIONES DE BÚSQUEDA
// ========================================

export async function searchProducts(query: string) {
  // Búsqueda simple por nombre y descripción
  return await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      categoryId: products.categoryId,
      brand: products.brand,
      origin: products.origin,
      type: products.type,
      images: products.images,
      status: products.isActive,
      isFeatured: products.isFeatured,
      tags: products.tags,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, 'active'),
        eq(categories.isActive, true)
      )
    )
    .orderBy(desc(products.isFeatured), asc(products.name));
}

// ========================================
// FUNCIONES DE ESTADÍSTICAS
// ========================================

export async function getProductStats() {
  // Contar productos por categoría
  const categoryStats = await db
    .select({
      categoryId: products.categoryId,
      categoryName: categories.name,
      productCount: sql<number>`count(${products.id})`.mapWith(Number),
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, 'active'))
    .groupBy(products.categoryId, categories.name);

  // Contar total de productos
  const totalProducts = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(products)
    .where(eq(products.isActive, 'active'));

  return {
    totalProducts: totalProducts[0]?.count || 0,
    byCategory: categoryStats,
  };
}

