import { db } from '@/db';
import { inventory, stockMovements, productVariants, products } from '@/db/schema';
import { eq, and, desc, asc, gte, lte, sql } from 'drizzle-orm';

// ========================================
// FUNCIONES PARA INVENTARIO
// ========================================

export async function getInventoryByVariant(variantId: string) {
  const result = await db
    .select({
      id: inventory.id,
      variantId: inventory.variantId,
      stockQuantity: inventory.stockQuantity,
      reservedQuantity: inventory.reservedQuantity,
      availableQuantity: inventory.availableQuantity,
      minStockLevel: inventory.minStockLevel,
      maxStockLevel: inventory.maxStockLevel,
      lastRestocked: inventory.lastRestocked,
      location: inventory.location,
      notes: inventory.notes,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
      variant: {
        id: productVariants.id,
        name: productVariants.name,
        weight: productVariants.weight,
        unit: productVariants.unit,
        price: productVariants.price,
        sku: productVariants.sku,
        productId: productVariants.productId,
        productName: products.name,
      }
    })
    .from(inventory)
    .leftJoin(productVariants, eq(inventory.variantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id))
    .where(eq(inventory.variantId, variantId))
    .limit(1);
  
  return result[0];
}

export async function getAllInventory() {
  return await db
    .select({
      id: inventory.id,
      variantId: inventory.variantId,
      stockQuantity: inventory.stockQuantity,
      reservedQuantity: inventory.reservedQuantity,
      availableQuantity: inventory.availableQuantity,
      minStockLevel: inventory.minStockLevel,
      maxStockLevel: inventory.maxStockLevel,
      lastRestocked: inventory.lastRestocked,
      location: inventory.location,
      notes: inventory.notes,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
      variant: {
        id: productVariants.id,
        name: productVariants.name,
        weight: productVariants.weight,
        unit: productVariants.unit,
        price: productVariants.price,
        sku: productVariants.sku,
        productId: productVariants.productId,
        productName: products.name,
      }
    })
    .from(inventory)
    .leftJoin(productVariants, eq(inventory.variantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id))
    .orderBy(asc(products.name), asc(productVariants.weight));
}

export async function getLowStockItems() {
  return await db
    .select({
      id: inventory.id,
      variantId: inventory.variantId,
      stockQuantity: inventory.stockQuantity,
      reservedQuantity: inventory.reservedQuantity,
      availableQuantity: inventory.availableQuantity,
      minStockLevel: inventory.minStockLevel,
      maxStockLevel: inventory.maxStockLevel,
      lastRestocked: inventory.lastRestocked,
      location: inventory.location,
      notes: inventory.notes,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
      variant: {
        id: productVariants.id,
        name: productVariants.name,
        weight: productVariants.weight,
        unit: productVariants.unit,
        price: productVariants.price,
        sku: productVariants.sku,
        productId: productVariants.productId,
        productName: products.name,
      }
    })
    .from(inventory)
    .leftJoin(productVariants, eq(inventory.variantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id))
    .where(
      sql`${inventory.stockQuantity} <= ${inventory.minStockLevel}`
    )
    .orderBy(asc(inventory.stockQuantity));
}

export async function getOutOfStockItems() {
  return await db
    .select({
      id: inventory.id,
      variantId: inventory.variantId,
      stockQuantity: inventory.stockQuantity,
      reservedQuantity: inventory.reservedQuantity,
      availableQuantity: inventory.availableQuantity,
      minStockLevel: inventory.minStockLevel,
      maxStockLevel: inventory.maxStockLevel,
      lastRestocked: inventory.lastRestocked,
      location: inventory.location,
      notes: inventory.notes,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
      variant: {
        id: productVariants.id,
        name: productVariants.name,
        weight: productVariants.weight,
        unit: productVariants.unit,
        price: productVariants.price,
        sku: productVariants.sku,
        productId: productVariants.productId,
        productName: products.name,
      }
    })
    .from(inventory)
    .leftJoin(productVariants, eq(inventory.variantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id))
    .where(eq(inventory.stockQuantity, 0))
    .orderBy(asc(products.name));
}

// ========================================
// FUNCIONES PARA MOVIMIENTOS DE STOCK
// ========================================

export async function getStockMovements(variantId: string, limit: number = 50) {
  return await db
    .select({
      id: stockMovements.id,
      variantId: stockMovements.variantId,
      type: stockMovements.type,
      quantity: stockMovements.quantity,
      previousStock: stockMovements.previousStock,
      newStock: stockMovements.newStock,
      reason: stockMovements.reason,
      referenceId: stockMovements.referenceId,
      referenceType: stockMovements.referenceType,
      notes: stockMovements.notes,
      createdBy: stockMovements.createdBy,
      createdAt: stockMovements.createdAt,
      variant: {
        id: productVariants.id,
        name: productVariants.name,
        weight: productVariants.weight,
        unit: productVariants.unit,
        sku: productVariants.sku,
        productId: productVariants.productId,
        productName: products.name,
      }
    })
    .from(stockMovements)
    .leftJoin(productVariants, eq(stockMovements.variantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id))
    .where(eq(stockMovements.variantId, variantId))
    .orderBy(desc(stockMovements.createdAt))
    .limit(limit);
}

export async function getAllStockMovements(limit: number = 100) {
  return await db
    .select({
      id: stockMovements.id,
      variantId: stockMovements.variantId,
      type: stockMovements.type,
      quantity: stockMovements.quantity,
      previousStock: stockMovements.previousStock,
      newStock: stockMovements.newStock,
      reason: stockMovements.reason,
      referenceId: stockMovements.referenceId,
      referenceType: stockMovements.referenceType,
      notes: stockMovements.notes,
      createdBy: stockMovements.createdBy,
      createdAt: stockMovements.createdAt,
      variant: {
        id: productVariants.id,
        name: productVariants.name,
        weight: productVariants.weight,
        unit: productVariants.unit,
        sku: productVariants.sku,
        productId: productVariants.productId,
        productName: products.name,
      }
    })
    .from(stockMovements)
    .leftJoin(productVariants, eq(stockMovements.variantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id))
    .orderBy(desc(stockMovements.createdAt))
    .limit(limit);
}

// ========================================
// FUNCIONES PARA ACTUALIZAR STOCK
// ========================================

export async function updateStock(
  variantId: string,
  quantityChange: number,
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
      .where(eq(inventory.variantId, variantId))
      .limit(1);

    if (currentInventory.length === 0) {
      throw new Error('Inventario no encontrado para esta variante');
    }

    const current = currentInventory[0];
    const previousStock = current.stockQuantity;
    const newStock = previousStock + quantityChange;

    // Verificar que el stock no sea negativo
    if (newStock < 0) {
      throw new Error('Stock insuficiente. Stock actual: ' + previousStock + ', solicitado: ' + Math.abs(quantityChange));
    }

    // Actualizar inventario
    await tx
      .update(inventory)
      .set({
        stockQuantity: newStock,
        availableQuantity: newStock - current.reservedQuantity,
        updatedAt: new Date(),
      })
      .where(eq(inventory.variantId, variantId));

    // Registrar movimiento de stock
    await tx.insert(stockMovements).values({
      variantId,
      type,
      quantity: quantityChange,
      previousStock,
      newStock,
      reason,
      referenceId,
      referenceType,
      notes,
      createdBy,
    });

    return {
      variantId,
      previousStock,
      newStock,
      quantityChange,
      type,
      reason,
    };
  });
}

export async function reserveStock(variantId: string, quantity: number, referenceId: string) {
  return await db.transaction(async (tx) => {
    // Obtener inventario actual
    const currentInventory = await tx
      .select()
      .from(inventory)
      .where(eq(inventory.variantId, variantId))
      .limit(1);

    if (currentInventory.length === 0) {
      throw new Error('Inventario no encontrado para esta variante');
    }

    const current = currentInventory[0];
    const newReservedQuantity = current.reservedQuantity + quantity;

    // Verificar que haya stock disponible
    if (newReservedQuantity > current.stockQuantity) {
      throw new Error('Stock insuficiente para reservar. Disponible: ' + (current.stockQuantity - current.reservedQuantity));
    }

    // Actualizar inventario
    await tx
      .update(inventory)
      .set({
        reservedQuantity: newReservedQuantity,
        availableQuantity: current.stockQuantity - newReservedQuantity,
        updatedAt: new Date(),
      })
      .where(eq(inventory.variantId, variantId));

    return {
      variantId,
      reservedQuantity: newReservedQuantity,
      availableQuantity: current.stockQuantity - newReservedQuantity,
    };
  });
}

export async function releaseReservedStock(variantId: string, quantity: number) {
  return await db.transaction(async (tx) => {
    // Obtener inventario actual
    const currentInventory = await tx
      .select()
      .from(inventory)
      .where(eq(inventory.variantId, variantId))
      .limit(1);

    if (currentInventory.length === 0) {
      throw new Error('Inventario no encontrado para esta variante');
    }

    const current = currentInventory[0];
    const newReservedQuantity = Math.max(0, current.reservedQuantity - quantity);

    // Actualizar inventario
    await tx
      .update(inventory)
      .set({
        reservedQuantity: newReservedQuantity,
        availableQuantity: current.stockQuantity - newReservedQuantity,
        updatedAt: new Date(),
      })
      .where(eq(inventory.variantId, variantId));

    return {
      variantId,
      reservedQuantity: newReservedQuantity,
      availableQuantity: current.stockQuantity - newReservedQuantity,
    };
  });
}

// ========================================
// FUNCIONES PARA RESTOCK
// ========================================

export async function restockVariant(
  variantId: string,
  quantity: number,
  reason: string = 'Restock',
  notes?: string,
  createdBy?: string
) {
  return await updateStock(
    variantId,
    quantity,
    'in',
    reason,
    undefined,
    'restock',
    notes,
    createdBy
  );
}

export async function bulkRestock(variants: Array<{
  variantId: string;
  quantity: number;
  notes?: string;
}>) {
  return await db.transaction(async (tx) => {
    const results = [];
    
    for (const variant of variants) {
      const result = await updateStock(
        variant.variantId,
        variant.quantity,
        'in',
        'Restock masivo',
        undefined,
        'bulk_restock',
        variant.notes
      );
      results.push(result);
    }
    
    return results;
  });
}

// ========================================
// FUNCIONES DE ESTADÍSTICAS
// ========================================

export async function getInventoryStats() {
  // Total de productos con stock
  const totalWithStock = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(inventory)
    .where(sql`${inventory.stockQuantity} > 0`);

  // Total de productos sin stock
  const totalOutOfStock = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(inventory)
    .where(eq(inventory.stockQuantity, 0));

  // Total de productos con stock bajo
  const totalLowStock = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(inventory)
    .where(sql`${inventory.stockQuantity} <= ${inventory.minStockLevel}`);

  // Valor total del inventario
  const totalValue = await db
    .select({
      totalValue: sql<number>`COALESCE(SUM(${inventory.stockQuantity} * COALESCE(${productVariants.cost}, 0)), 0)`.mapWith(Number),
    })
    .from(inventory)
    .leftJoin(productVariants, eq(inventory.variantId, productVariants.id));

  return {
    totalWithStock: totalWithStock[0]?.count || 0,
    totalOutOfStock: totalOutOfStock[0]?.count || 0,
    totalLowStock: totalLowStock[0]?.count || 0,
    totalValue: totalValue[0]?.totalValue || 0,
  };
}

export async function getInventoryAlerts() {
  const lowStock = await getLowStockItems();
  const outOfStock = await getOutOfStockItems();

  return {
    lowStock,
    outOfStock,
    totalAlerts: lowStock.length + outOfStock.length,
  };
}

