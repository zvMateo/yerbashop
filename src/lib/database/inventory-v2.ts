import { db } from '@/db';
import { inventory, stockMovements, products } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// ========================================
// FUNCIONES PARA INVENTARIO (en KG)
// ========================================

export async function getAllInventory() {
  return await db
    .select({
      id: inventory.id,
      productId: inventory.productId,
      stockKg: inventory.stockKg,
      reservedKg: inventory.reservedKg,
      availableKg: inventory.availableKg,
      minStockKg: inventory.minStockKg,
      maxStockKg: inventory.maxStockKg,
      costPerKg: inventory.costPerKg,
      lastRestocked: inventory.lastRestocked,
      location: inventory.location,
      notes: inventory.notes,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
      product: {
        id: products.id,
        name: products.name,
        brand: products.brand,
        pricesPerKg: products.pricesPerKg,
      }
    })
    .from(inventory)
    .leftJoin(products, eq(inventory.productId, products.id))
    .orderBy(products.name);
}

export async function getInventoryByProduct(productId: string) {
  const result = await db
    .select({
      id: inventory.id,
      productId: inventory.productId,
      stockKg: inventory.stockKg,
      reservedKg: inventory.reservedKg,
      availableKg: inventory.availableKg,
      minStockKg: inventory.minStockKg,
      maxStockKg: inventory.maxStockKg,
      costPerKg: inventory.costPerKg,
      lastRestocked: inventory.lastRestocked,
      location: inventory.location,
      notes: inventory.notes,
      product: {
        name: products.name,
        brand: products.brand,
      }
    })
    .from(inventory)
    .leftJoin(products, eq(inventory.productId, products.id))
    .where(eq(inventory.productId, productId))
    .limit(1);
  
  return result[0];
}

export async function getLowStockItems() {
  return await db
    .select({
      id: inventory.id,
      productId: inventory.productId,
      stockKg: inventory.stockKg,
      availableKg: inventory.availableKg,
      minStockKg: inventory.minStockKg,
      product: {
        name: products.name,
        brand: products.brand,
      }
    })
    .from(inventory)
    .leftJoin(products, eq(inventory.productId, products.id))
    .where(sql`CAST(${inventory.stockKg} AS DECIMAL) <= CAST(${inventory.minStockKg} AS DECIMAL)`)
    .orderBy(inventory.stockKg);
}

export async function getOutOfStockItems() {
  return await db
    .select({
      id: inventory.id,
      productId: inventory.productId,
      stockKg: inventory.stockKg,
      product: {
        name: products.name,
        brand: products.brand,
      }
    })
    .from(inventory)
    .leftJoin(products, eq(inventory.productId, products.id))
    .where(sql`CAST(${inventory.stockKg} AS DECIMAL) = 0`)
    .orderBy(products.name);
}

export async function getInventoryStats() {
  // Total de productos con stock
  const totalWithStock = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(inventory)
    .where(sql`CAST(${inventory.stockKg} AS DECIMAL) > 0`);

  // Total de productos sin stock
  const totalOutOfStock = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(inventory)
    .where(sql`CAST(${inventory.stockKg} AS DECIMAL) = 0`);

  // Total de productos con stock bajo
  const totalLowStock = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(inventory)
    .where(sql`CAST(${inventory.stockKg} AS DECIMAL) <= CAST(${inventory.minStockKg} AS DECIMAL)`);

  // Valor total del inventario (stockKg × costPerKg)
  const totalValue = await db
    .select({
      totalValue: sql<number>`COALESCE(SUM(CAST(${inventory.stockKg} AS DECIMAL) * CAST(COALESCE(${inventory.costPerKg}, 0) AS DECIMAL)), 0)`.mapWith(Number),
    })
    .from(inventory);

  // Stock total en KG
  const totalStockKg = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${inventory.stockKg} AS DECIMAL)), 0)`.mapWith(Number),
    })
    .from(inventory);

  return {
    totalWithStock: totalWithStock[0]?.count || 0,
    totalOutOfStock: totalOutOfStock[0]?.count || 0,
    totalLowStock: totalLowStock[0]?.count || 0,
    totalValue: totalValue[0]?.totalValue || 0,
    totalStockKg: totalStockKg[0]?.total || 0,
  };
}

// ========================================
// FUNCIONES PARA ACTUALIZAR STOCK (en KG)
// ========================================

export async function updateStockKg(
  productId: string,
  quantityKgChange: number,
  type: 'in' | 'out' | 'adjustment' | 'transfer',
  reason: string,
  referenceId?: string,
  referenceType?: string,
  notes?: string,
  createdBy?: string
) {
  return await db.transaction(async (tx) => {
    // Obtener inventario actual
    const currentInventory = await tx
      .select()
      .from(inventory)
      .where(eq(inventory.productId, productId))
      .limit(1);

    if (currentInventory.length === 0) {
      throw new Error('Inventario no encontrado para este producto');
    }

    const current = currentInventory[0];
    const previousStockKg = parseFloat(current.stockKg);
    const newStockKg = previousStockKg + quantityKgChange;

    // Verificar que el stock no sea negativo
    if (newStockKg < 0) {
      throw new Error(`Stock insuficiente. Stock actual: ${previousStockKg}kg, solicitado: ${Math.abs(quantityKgChange)}kg`);
    }

    const reservedKg = parseFloat(current.reservedKg);

    // Actualizar inventario
    await tx
      .update(inventory)
      .set({
        stockKg: newStockKg.toString(),
        availableKg: (newStockKg - reservedKg).toString(),
        updatedAt: new Date(),
      })
      .where(eq(inventory.productId, productId));

    // Registrar movimiento de stock
    await tx.insert(stockMovements).values({
      productId,
      type,
      quantityKg: quantityKgChange.toString(),
      previousStockKg: previousStockKg.toString(),
      newStockKg: newStockKg.toString(),
      reason,
      referenceId: referenceId || null,
      referenceType: referenceType || null,
      notes: notes || null,
      createdBy: createdBy || null,
    });

    return {
      productId,
      previousStockKg,
      newStockKg,
      quantityKgChange,
      type,
      reason,
    };
  });
}

export async function reserveStockKg(productId: string, quantityKg: number, referenceId: string) {
  return await db.transaction(async (tx) => {
    const currentInventory = await tx
      .select()
      .from(inventory)
      .where(eq(inventory.productId, productId))
      .limit(1);

    if (currentInventory.length === 0) {
      throw new Error('Inventario no encontrado');
    }

    const current = currentInventory[0];
    const stockKg = parseFloat(current.stockKg);
    const reservedKg = parseFloat(current.reservedKg);
    const newReservedKg = reservedKg + quantityKg;

    if (newReservedKg > stockKg) {
      throw new Error(`Stock insuficiente para reservar. Disponible: ${stockKg - reservedKg}kg`);
    }

    await tx
      .update(inventory)
      .set({
        reservedKg: newReservedKg.toString(),
        availableKg: (stockKg - newReservedKg).toString(),
        updatedAt: new Date(),
      })
      .where(eq(inventory.productId, productId));

    return {
      productId,
      reservedKg: newReservedKg,
      availableKg: stockKg - newReservedKg,
    };
  });
}

export async function restockProduct(
  productId: string,
  quantityKg: number,
  reason: string = 'Restock',
  notes?: string,
  createdBy?: string
) {
  return await updateStockKg(
    productId,
    quantityKg,
    'in',
    reason,
    undefined,
    'restock',
    notes,
    createdBy
  );
}

