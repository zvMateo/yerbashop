import { pgTable, text, timestamp, uuid, integer, decimal, boolean, jsonb, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ========================================
// ENUMS
// ========================================

export const productStatusEnum = pgEnum('product_status', ['active', 'inactive', 'draft']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']);
export const stockMovementTypeEnum = pgEnum('stock_movement_type', ['in', 'out', 'adjustment', 'transfer']);
export const saleChannelEnum = pgEnum('sale_channel', ['online', 'whatsapp', 'instagram', 'presencial']);
export const customerTypeEnum = pgEnum('customer_type', ['guest', 'registered']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'customer']);

// ========================================
// CATEGORÍAS
// ========================================
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image: text('image'),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// PRODUCTOS (Variedades de yerba)
// ========================================
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // "Yerba Despalada Fina", "Yerba Xanaes"
  slug: text('slug').notNull().unique(),
  description: text('description'),
  longDescription: text('long_description'),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  brand: text('brand'),
  origin: text('origin'),
  type: text('type'),
  images: jsonb('images').$type<string[]>().default([]),
  isActive: productStatusEnum('status').notNull().default('draft'),
  isFeatured: boolean('is_featured').default(false),
  tags: jsonb('tags').$type<string[]>().default([]),
  
  // NUEVO: Precios por tamaño de empaquetado
  // { "0.5": 1200, "1": 2200, "2": 4200, "3": 6000 }
  pricesPerKg: jsonb('prices_per_kg').$type<Record<string, number>>().notNull(),
  
  // Tamaños disponibles para este producto
  availableSizes: jsonb('available_sizes').$type<number[]>().default([0.5, 1, 2, 3]),
  
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// INVENTARIO (Stock en KG por producto)
// ========================================
export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id).unique(), // 1 inventario por producto
  
  // Stock en KILOGRAMOS
  stockKg: decimal('stock_kg', { precision: 10, scale: 3 }).notNull().default('0'), // 20.500 kg
  reservedKg: decimal('reserved_kg', { precision: 10, scale: 3 }).notNull().default('0'), // 1.500 kg reservado
  availableKg: decimal('available_kg', { precision: 10, scale: 3 }).notNull().default('0'), // 19.000 kg disponible
  
  // Alertas
  minStockKg: decimal('min_stock_kg', { precision: 10, scale: 3 }).default('5'), // Alertar si baja de 5kg
  maxStockKg: decimal('max_stock_kg', { precision: 10, scale: 3 }).default('100'), // Máximo 100kg
  
  // Información adicional
  lastRestocked: timestamp('last_restocked'),
  costPerKg: decimal('cost_per_kg', { precision: 10, scale: 2 }), // Costo por kg (para calcular valor)
  location: text('location').default('principal'),
  notes: text('notes'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// MOVIMIENTOS DE STOCK (en KG)
// ========================================
export const stockMovements = pgTable('stock_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id), // ← Cambio: productId en lugar de variantId
  type: stockMovementTypeEnum('type').notNull(),
  quantityKg: decimal('quantity_kg', { precision: 10, scale: 3 }).notNull(), // KG movidos (ej: 1.5)
  previousStockKg: decimal('previous_stock_kg', { precision: 10, scale: 3 }).notNull(),
  newStockKg: decimal('new_stock_kg', { precision: 10, scale: 3 }).notNull(),
  reason: text('reason'),
  referenceId: uuid('reference_id'), // ID de pedido, etc.
  referenceType: text('reference_type'),
  notes: text('notes'),
  createdBy: uuid('created_by'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ========================================
// CLIENTES
// ========================================
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerType: customerTypeEnum('customer_type').notNull().default('guest'),
  
  // NextAuth fields
  role: userRoleEnum('role').notNull().default('customer'), // 'admin' | 'customer'
  password: text('password'), // Para credentials (nullable para OAuth)
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'), // Para avatar de OAuth
  
  // Legacy Clerk field (deprecated)
  clerkUserId: text('clerk_user_id').unique(),
  
  email: text('email').unique(),
  phone: text('phone'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  fullName: text('full_name').notNull(),
  dateOfBirth: timestamp('date_of_birth'),
  gender: text('gender'),
  avatar: text('avatar'),
  isActive: boolean('is_active').notNull().default(true),
  isVerified: boolean('is_verified').notNull().default(false),
  preferences: jsonb('preferences').$type<{
    notifications: boolean;
    newsletter: boolean;
    preferredChannel: string;
  }>().default({ notifications: true, newsletter: false, preferredChannel: 'whatsapp' }),
  
  // Sistema de puntos
  loyaltyPoints: integer('loyalty_points').default(0),
  loyaltyTier: text('loyalty_tier').default('bronce'),
  
  totalOrders: integer('total_orders').default(0),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).default('0'),
  lastOrderDate: timestamp('last_order_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// TABLAS DE NEXTAUTH ADAPTER
// ========================================

// Accounts (para OAuth providers)
export const accounts = pgTable("accounts", {
  userId: uuid("userId").notNull().references(() => customers.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

// Sessions
export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId").notNull().references(() => customers.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification Tokens
export const verificationTokens = pgTable("verificationTokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// ========================================
// DIRECCIONES
// ========================================
export const customerAddresses = pgTable('customer_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  type: text('type').notNull().default('shipping'),
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
  instructions: text('instructions'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ========================================
// PEDIDOS
// ========================================
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('order_number').notNull().unique(),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  status: orderStatusEnum('status').notNull().default('pending'),
  channel: saleChannelEnum('channel').notNull().default('online'),
  
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone').notNull(),
  
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
  
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  
  paymentMethod: text('payment_method'),
  paymentStatus: text('payment_status').default('pending'),
  paymentReference: text('payment_reference'),
  
  shippingMethod: text('shipping_method').default('standard'),
  trackingNumber: text('tracking_number'),
  estimatedDelivery: timestamp('estimated_delivery'),
  deliveredAt: timestamp('delivered_at'),
  
  notes: text('notes'),
  internalNotes: text('internal_notes'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  confirmedAt: timestamp('confirmed_at'),
  shippedAt: timestamp('shipped_at'),
});

// ========================================
// ITEMS DE PEDIDOS (Con tamaño en KG)
// ========================================
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  productId: uuid('product_id').notNull().references(() => products.id), // ← Cambio: productId en lugar de variantId
  
  productName: text('product_name').notNull(), // "Yerba Despalada Fina"
  sizeKg: decimal('size_kg', { precision: 5, scale: 2 }).notNull(), // 0.5, 1.0, 2.0, 3.0
  quantity: integer('quantity').notNull(), // Cantidad de bolsas
  totalKg: decimal('total_kg', { precision: 10, scale: 3 }).notNull(), // size_kg × quantity (ej: 0.5 × 3 = 1.5)
  
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(), // Precio por bolsa
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(), // unitPrice × quantity
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ========================================
// TABLAS DE LOYALTY (sin cambios)
// ========================================
export const loyaltyTransactions = pgTable('loyalty_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  orderId: uuid('order_id').references(() => orders.id),
  points: integer('points').notNull(),
  type: text('type').notNull(),
  reason: text('reason').notNull(),
  previousBalance: integer('previous_balance').notNull(),
  newBalance: integer('new_balance').notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const loyaltyRewards = pgTable('loyalty_rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  pointsCost: integer('points_cost').notNull(),
  discountType: text('discount_type'),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }),
  minPurchaseAmount: decimal('min_purchase_amount', { precision: 10, scale: 2 }).default('0'),
  maxUses: integer('max_uses'),
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
  orderId: uuid('order_id').references(() => orders.id),
  pointsUsed: integer('points_used').notNull(),
  status: text('status').notNull().default('active'),
  usedAt: timestamp('used_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ========================================
// RELACIONES
// ========================================

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  inventory: one(inventory),
  stockMovements: many(stockMovements),
  orderItems: many(orderItems),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  addresses: many(customerAddresses),
  loyaltyTransactions: many(loyaltyTransactions),
  loyaltyRedemptions: many(loyaltyRedemptions),
}));

export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
  customer: one(customers, {
    fields: [customerAddresses.customerId],
    references: [customers.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

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
