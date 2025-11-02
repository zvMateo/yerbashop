import { db } from '@/db';
import { orders, orderItems, customers, customerAddresses } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { updateStock } from './inventory';

// ========================================
// FUNCIONES PARA CLIENTES
// ========================================

export async function findOrCreateCustomer(data: {
  email?: string;
  phone: string;
  fullName: string;
  customerType?: 'guest' | 'registered';
}) {
  // Buscar cliente existente por email o teléfono
  let existingCustomer;
  
  if (data.email) {
    const byEmail = await db
      .select()
      .from(customers)
      .where(eq(customers.email, data.email))
      .limit(1);
    
    if (byEmail.length > 0) {
      existingCustomer = byEmail[0];
    }
  }
  
  if (!existingCustomer && data.phone) {
    const byPhone = await db
      .select()
      .from(customers)
      .where(eq(customers.phone, data.phone))
      .limit(1);
    
    if (byPhone.length > 0) {
      existingCustomer = byPhone[0];
    }
  }

  // Si existe, retornarlo
  if (existingCustomer) {
    return existingCustomer;
  }

  // Si no existe, crear nuevo cliente
  const [newCustomer] = await db.insert(customers).values({
    customerType: data.customerType || 'guest',
    email: data.email || null,
    phone: data.phone,
    fullName: data.fullName,
    isActive: true,
  }).returning();

  return newCustomer;
}

// ========================================
// FUNCIONES PARA PEDIDOS
// ========================================

export async function createOrder(orderData: {
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  channel: 'online' | 'whatsapp' | 'instagram' | 'presencial';
  shippingAddress: {
    street: string;
    number: string;
    floor?: string;
    apartment?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    instructions?: string;
  };
  items: Array<{
    variantId: string;
    productName: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
  }>;
  paymentMethod?: string;
  shippingCost?: number;
  discount?: number;
  notes?: string;
}) {
  return await db.transaction(async (tx) => {
    // Calcular totales
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const shippingCost = orderData.shippingCost || 0;
    const discount = orderData.discount || 0;
    const total = subtotal + shippingCost - discount;

    // Generar número de pedido único
    const orderNumber = await generateOrderNumber();

    // Crear pedido
    const [order] = await tx.insert(orders).values({
      orderNumber,
      customerId: orderData.customerId,
      status: 'confirmed', // Ventas manuales se confirman inmediatamente
      channel: orderData.channel,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail || null,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      subtotal: subtotal.toString(),
      shippingCost: shippingCost.toString(),
      discount: discount.toString(),
      total: total.toString(),
      paymentMethod: orderData.paymentMethod || 'efectivo',
      paymentStatus: 'paid', // Ventas manuales se marcan como pagadas
      notes: orderData.notes || null,
      confirmedAt: new Date(),
    }).returning();

    // Crear items del pedido
    for (const item of orderData.items) {
      await tx.insert(orderItems).values({
        orderId: order.id,
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        totalPrice: (item.unitPrice * item.quantity).toString(),
      });

      // Descontar stock automáticamente
      await updateStock(
        item.variantId,
        -item.quantity, // Negativo para descontar
        'out',
        `Venta ${orderData.channel} - Pedido ${orderNumber}`,
        order.id,
        'order',
        `Venta manual - ${orderData.channel}`,
        undefined
      );
    }

    // Actualizar estadísticas del cliente
    await tx
      .update(customers)
      .set({
        totalOrders: sql`${customers.totalOrders} + 1`,
        totalSpent: sql`${customers.totalSpent} + ${total}`,
        lastOrderDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(customers.id, orderData.customerId));

    return order;
  });
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

async function generateOrderNumber(): Promise<string> {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  // Contar pedidos de hoy
  const todayStart = new Date(year, today.getMonth(), today.getDate());
  const todayEnd = new Date(year, today.getMonth(), today.getDate() + 1);
  
  const todayOrders = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(orders)
    .where(
      sql`${orders.createdAt} >= ${todayStart.toISOString()} AND ${orders.createdAt} < ${todayEnd.toISOString()}`
    );

  const orderCount = (todayOrders[0]?.count || 0) + 1;
  const orderNum = String(orderCount).padStart(4, '0');
  
  return `ORD-${year}${month}${day}-${orderNum}`;
}

// ========================================
// FUNCIONES PARA CONSULTAS
// ========================================

export async function getAllOrders(limit: number = 50) {
  return await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerId: orders.customerId,
      status: orders.status,
      channel: orders.channel,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      customerPhone: orders.customerPhone,
      total: orders.total,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
      confirmedAt: orders.confirmedAt,
      shippedAt: orders.shippedAt,
      deliveredAt: orders.deliveredAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit);
}

export async function getOrderById(orderId: string) {
  const orderData = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (orderData.length === 0) return null;

  const order = orderData[0];

  // Obtener items del pedido
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))
    .orderBy(orderItems.createdAt);

  return {
    ...order,
    items,
  };
}

export async function getOrdersByCustomer(customerId: string) {
  return await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customerId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderStats() {
  // Total de pedidos
  const totalOrders = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(orders);

  // Pedidos por canal
  const ordersByChannel = await db
    .select({
      channel: orders.channel,
      count: sql<number>`count(*)`.mapWith(Number),
      totalSales: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`.mapWith(Number),
    })
    .from(orders)
    .groupBy(orders.channel);

  // Pedidos por estado
  const ordersByStatus = await db
    .select({
      status: orders.status,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(orders)
    .groupBy(orders.status);

  // Total de ventas
  const totalSales = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`.mapWith(Number),
    })
    .from(orders)
    .where(eq(orders.paymentStatus, 'paid'));

  return {
    totalOrders: totalOrders[0]?.count || 0,
    totalSales: totalSales[0]?.total || 0,
    byChannel: ordersByChannel,
    byStatus: ordersByStatus,
  };
}
