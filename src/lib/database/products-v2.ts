import { db } from '@/db';
import { products, categories, inventory } from '@/db/schema';
import { eq, and, desc, asc, sql } from 'drizzle-orm';

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
      pricesPerKg: products.pricesPerKg,
      availableSizes: products.availableSizes,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
      inventory: {
        stockKg: inventory.stockKg,
        availableKg: inventory.availableKg,
        reservedKg: inventory.reservedKg,
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(inventory, eq(products.id, inventory.productId))
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
      pricesPerKg: products.pricesPerKg,
      availableSizes: products.availableSizes,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
      inventory: {
        id: inventory.id,
        stockKg: inventory.stockKg,
        availableKg: inventory.availableKg,
        reservedKg: inventory.reservedKg,
        minStockKg: inventory.minStockKg,
        costPerKg: inventory.costPerKg,
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(inventory, eq(products.id, inventory.productId))
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
      pricesPerKg: products.pricesPerKg,
      availableSizes: products.availableSizes,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
      inventory: {
        stockKg: inventory.stockKg,
        availableKg: inventory.availableKg,
        reservedKg: inventory.reservedKg,
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(inventory, eq(products.id, inventory.productId))
    .where(eq(products.slug, slug))
    .limit(1);
  
  return result[0];
}

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

// ========================================
// FUNCIONES PARA OBTENER PRECIOS
// ========================================

export function getPriceForSize(product: Product, sizeKg: number): number | null {
  if (!product.pricesPerKg) return null;
  
  const key = sizeKg.toString();
  return product.pricesPerKg[key] || null;
}

export function getAvailableSizesWithPrices(product: Product): Array<{ size: number; price: number }> {
  if (!product.availableSizes || !product.pricesPerKg) return [];
  
  return product.availableSizes
    .map(size => ({
      size,
      price: product.pricesPerKg![size.toString()] || 0,
    }))
    .filter(item => item.price > 0)
    .sort((a, b) => a.size - b.size);
}

// Tipos
type Product = typeof products.$inferSelect;

