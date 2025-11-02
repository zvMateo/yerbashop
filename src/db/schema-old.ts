import { pgTable, text, timestamp, uuid, integer, decimal, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ========================================
// ENUMS
// ========================================

export const productStatusEnum = pgEnum('product_status', ['active', 'inactive', 'draft']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']);
export const stockMovementTypeEnum = pgEnum('stock_movement_type', ['in', 'out', 'adjustment', 'transfer']);
export const saleChannelEnum = pgEnum('sale_channel', ['online', 'whatsapp', 'instagram', 'presencial']);
export const customerTypeEnum = pgEnum('customer_type', ['guest', 'registered']);

// ========================================
// CATEGORÍAS
// ========================================
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(), // "Yerba Mate", "Yuyos", "Mates", "Yerberas"
  slug: text('slug').notNull().unique(), // "yerba-mate", "yuyos", etc.
  description: text('description'),
  image: text('image'), // URL de imagen de categoría
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// PRODUCTOS
// ========================================
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // "Yerba Xanaes", "Yerba Amanda"
  slug: text('slug').notNull().unique(),
  description: text('description'),
  longDescription: text('long_description'),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  brand: text('brand'), // "Xanaes", "Amanda", etc.
  origin: text('origin'), // "Misiones", "Corrientes", etc.
  type: text('type'), // "Suave", "Fuerte", "Agroecológica"
  images: jsonb('images').$type<string[]>().default([]), // Array de URLs de imágenes
  isActive: productStatusEnum('status').notNull().default('draft'),
  isFeatured: boolean('is_featured').default(false),
  tags: jsonb('tags').$type<string[]>().default([]), // ["organico", "agroecologico"]
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// VARIANTES DE PRODUCTOS
// ========================================
export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id),
  name: text('name').notNull(), // "0.5kg", "1kg", "2kg", "3kg"
  weight: decimal('weight', { precision: 5, scale: 2 }).notNull(), // 0.5, 1.0, 2.0, 3.0
  unit: text('unit').notNull().default('kg'), // "kg", "gr"
  price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Precio de venta
  cost: decimal('cost', { precision: 10, scale: 2 }), // Costo de producción
  sku: text('sku').notNull().unique(), // Código único: "XAN-05KG", "XAN-1KG"
  barcode: text('barcode'), // Código de barras
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// INVENTARIO
// ========================================
export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id),
  stockQuantity: integer('stock_quantity').notNull().default(0), // Stock actual
  reservedQuantity: integer('reserved_quantity').notNull().default(0), // Stock reservado
  availableQuantity: integer('available_quantity').notNull().default(0), // Stock disponible (stock - reservado)
  minStockLevel: integer('min_stock_level').default(10), // Nivel mínimo de stock
  maxStockLevel: integer('max_stock_level').default(1000), // Nivel máximo de stock
  lastRestocked: timestamp('last_restocked'),
  location: text('location').default('principal'), // Ubicación en almacén
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// MOVIMIENTOS DE STOCK
// ========================================
export const stockMovements = pgTable('stock_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id),
  type: stockMovementTypeEnum('type').notNull(), // 'in', 'out', 'adjustment', 'transfer'
  quantity: integer('quantity').notNull(), // Cantidad movida (positiva o negativa)
  previousStock: integer('previous_stock').notNull(), // Stock antes del movimiento
  newStock: integer('new_stock').notNull(), // Stock después del movimiento
  reason: text('reason'), // "Venta", "Restock", "Ajuste de inventario", "Pérdida"
  referenceId: uuid('reference_id'), // ID de pedido, factura, etc.
  referenceType: text('reference_type'), // "order", "purchase", "adjustment"
  notes: text('notes'),
  createdBy: uuid('created_by'), // ID del usuario que hizo el movimiento
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ========================================
// CLIENTES
// ========================================
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerType: customerTypeEnum('customer_type').notNull().default('guest'), // 'guest' o 'registered'
  clerkUserId: text('clerk_user_id').unique(), // ID de Clerk para usuarios registrados (null para invitados)
  email: text('email').unique(),
  phone: text('phone'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  fullName: text('full_name').notNull(),
  dateOfBirth: timestamp('date_of_birth'),
  gender: text('gender'), // 'male', 'female', 'other'
  avatar: text('avatar'), // URL de foto de perfil
  isActive: boolean('is_active').notNull().default(true),
  isVerified: boolean('is_verified').notNull().default(false),
  preferences: jsonb('preferences').$type<{
    notifications: boolean;
    newsletter: boolean;
    preferredChannel: string;
  }>().default({ notifications: true, newsletter: false, preferredChannel: 'whatsapp' }),
  
  // Sistema de puntos/fidelidad (solo para registrados)
  loyaltyPoints: integer('loyalty_points').default(0),
  loyaltyTier: text('loyalty_tier').default('bronce'), // 'bronce', 'plata', 'oro'
  
  // Estadísticas
  totalOrders: integer('total_orders').default(0),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).default('0'),
  lastOrderDate: timestamp('last_order_date'),
  
  notes: text('notes'), // Notas internas sobre el cliente
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// DIRECCIONES DE CLIENTES
// ========================================
export const customerAddresses = pgTable('customer_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  type: text('type').notNull().default('shipping'), // 'shipping', 'billing'
  isDefault: boolean('is_default').default(false),
  street: text('street').notNull(),
  number: text('number').notNull(),
  floor: text('floor'),
  apartment: text('apartment'),
  neighborhood: text('neighborhood').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull().default('Argentina'),
  instructions: text('instructions'), // Instrucciones especiales de entrega
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// PEDIDOS
// ========================================
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('order_number').notNull().unique(), // "ORD-2024-001"
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  status: orderStatusEnum('status').notNull().default('pending'),
  channel: saleChannelEnum('channel').notNull().default('online'),
  
  // Información de contacto
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone').notNull(),
  
  // Dirección de envío
  shippingAddress: jsonb('shipping_address').$type<{
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
  }>().notNull(),
  
  // Totales
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  
  // Método de pago
  paymentMethod: text('payment_method'), // "mercadopago", "transferencia", "efectivo"
  paymentStatus: text('payment_status').default('pending'), // "pending", "paid", "failed"
  paymentReference: text('payment_reference'), // ID de pago en MercadoPago
  
  // Envío
  shippingMethod: text('shipping_method').default('standard'),
  trackingNumber: text('tracking_number'),
  estimatedDelivery: timestamp('estimated_delivery'),
  deliveredAt: timestamp('delivered_at'),
  
  // Notas
  notes: text('notes'),
  internalNotes: text('internal_notes'),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  confirmedAt: timestamp('confirmed_at'),
  shippedAt: timestamp('shipped_at'),
});

// ========================================
// ITEMS DE PEDIDOS
// ========================================
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id),
  productName: text('product_name').notNull(), // Nombre del producto al momento de la compra
  variantName: text('variant_name').notNull(), // "1kg", "2kg", etc.
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ========================================
// SISTEMA DE PUNTOS/FIDELIDAD
// ========================================
export const loyaltyTransactions = pgTable('loyalty_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  orderId: uuid('order_id').references(() => orders.id), // Referencia al pedido si aplica
  points: integer('points').notNull(), // Positivo para acreditar, negativo para canjear
  type: text('type').notNull(), // 'earned', 'redeemed', 'expired', 'bonus', 'adjustment'
  reason: text('reason').notNull(), // "Compra de $2000", "Canje de descuento", etc.
  previousBalance: integer('previous_balance').notNull(),
  newBalance: integer('new_balance').notNull(),
  expiresAt: timestamp('expires_at'), // Los puntos pueden expirar
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const loyaltyRewards = pgTable('loyalty_rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // "10% descuento", "Envío gratis"
  description: text('description'),
  pointsCost: integer('points_cost').notNull(), // Puntos necesarios para canjear
  discountType: text('discount_type'), // 'percentage', 'fixed', 'free_shipping'
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }), // 10 (para 10%), 500 (para $500)
  minPurchaseAmount: decimal('min_purchase_amount', { precision: 10, scale: 2 }).default('0'),
  maxUses: integer('max_uses'), // Límite de usos totales (null = ilimitado)
  usedCount: integer('used_count').default(0),
  isActive: boolean('is_active').notNull().default(true),
  validFrom: timestamp('valid_from'),
  validUntil: timestamp('valid_until'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const loyaltyRedemptions = pgTable('loyalty_redemptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  rewardId: uuid('reward_id').notNull().references(() => loyaltyRewards.id),
  orderId: uuid('order_id').references(() => orders.id), // Pedido donde se aplicó
  pointsUsed: integer('points_used').notNull(),
  status: text('status').notNull().default('active'), // 'active', 'used', 'expired'
  usedAt: timestamp('used_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ========================================
// RELACIONES
// ========================================

// Categorías -> Productos
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// Productos -> Categorías
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
}));

// Productos -> Variantes
export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  inventory: one(inventory),
  stockMovements: many(stockMovements),
  orderItems: many(orderItems),
}));

// Variantes -> Inventario
export const inventoryRelations = relations(inventory, ({ one }) => ({
  variant: one(productVariants, {
    fields: [inventory.variantId],
    references: [productVariants.id],
  }),
}));

// Variantes -> Movimientos de Stock
export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  variant: one(productVariants, {
    fields: [stockMovements.variantId],
    references: [productVariants.id],
  }),
}));

// Clientes -> Pedidos
export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  addresses: many(customerAddresses),
  loyaltyTransactions: many(loyaltyTransactions),
  loyaltyRedemptions: many(loyaltyRedemptions),
}));

// Clientes -> Direcciones
export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
  customer: one(customers, {
    fields: [customerAddresses.customerId],
    references: [customers.id],
  }),
}));

// Pedidos -> Clientes
export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

// Pedidos -> Items
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

// Loyalty Transactions -> Customers
export const loyaltyTransactionsRelations = relations(loyaltyTransactions, ({ one }) => ({
  customer: one(customers, {
    fields: [loyaltyTransactions.customerId],
    references: [customers.id],
  }),
  order: one(orders, {
    fields: [loyaltyTransactions.orderId],
    references: [orders.id],
  }),
}));

// Loyalty Redemptions -> Customers & Rewards
export const loyaltyRedemptionsRelations = relations(loyaltyRedemptions, ({ one }) => ({
  customer: one(customers, {
    fields: [loyaltyRedemptions.customerId],
    references: [customers.id],
  }),
  reward: one(loyaltyRewards, {
    fields: [loyaltyRedemptions.rewardId],
    references: [loyaltyRewards.id],
  }),
  order: one(orders, {
    fields: [loyaltyRedemptions.orderId],
    references: [orders.id],
  }),
}));

// Loyalty Rewards -> Redemptions
export const loyaltyRewardsRelations = relations(loyaltyRewards, ({ many }) => ({
  redemptions: many(loyaltyRedemptions),
}));

// ========================================
// TIPOS PARA TYPESCRIPT
// ========================================
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type Inventory = typeof inventory.$inferSelect;
export type NewInventory = typeof inventory.$inferInsert;

export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type CustomerAddress = typeof customerAddresses.$inferSelect;
export type NewCustomerAddress = typeof customerAddresses.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type NewLoyaltyTransaction = typeof loyaltyTransactions.$inferInsert;

export type LoyaltyReward = typeof loyaltyRewards.$inferSelect;
export type NewLoyaltyReward = typeof loyaltyRewards.$inferInsert;

export type LoyaltyRedemption = typeof loyaltyRedemptions.$inferSelect;
export type NewLoyaltyRedemption = typeof loyaltyRedemptions.$inferInsert;

