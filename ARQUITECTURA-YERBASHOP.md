# 🏗️ ARQUITECTURA DE YERBASHOP

## 📋 RESUMEN EJECUTIVO

YerbaShop es una plataforma ecommerce con dashboard administrativo diseñada específicamente para la venta de yerba mate agroecológica y productos relacionados.

## 👥 ROLES DEL SISTEMA

### 1. ADMIN (Tu clienta)
**Acceso:** Dashboard completo en `/dashboard`
**Autenticación:** Clerk (obligatoria)

**Funcionalidades:**
- ✅ Gráficos interactivos y métricas de negocio
- ✅ CRUD completo de productos y variantes
- ✅ Gestión de inventario y control de stock
- ✅ Registro manual de ventas presenciales
- ✅ Visualización automática de ventas online
- ✅ Gestión de clientes (registrados e invitados)
- ✅ Administración del sistema de puntos
- ✅ Reportes y análisis de ventas

### 2. CLIENTE FINAL
**Acceso:** Tienda pública en `/` y `/tienda`
**Autenticación:** Opcional

#### 2A. Cliente Invitado (Guest)
**Sin registro necesario:**
- ✅ Navegar catálogo de productos
- ✅ Agregar al carrito
- ✅ Checkout rápido (solo nombre, email, teléfono, dirección)
- ✅ Realizar pago
- ❌ NO acumula puntos
- ❌ NO guarda historial
- ❌ NO tiene beneficios exclusivos

#### 2B. Cliente Registrado
**Con cuenta activa:**
- ✅ Todas las funciones de invitado
- ✅ Acumula puntos por cada compra
- ✅ Canjea puntos por descuentos
- ✅ Beneficios según nivel (Bronce, Plata, Oro)
- ✅ Historial de pedidos
- ✅ Direcciones guardadas
- ✅ Seguimiento de pedidos

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### TABLAS PRINCIPALES (9 + 3 loyalty)

#### 1. **categories** - Categorías de productos
```typescript
{
  id, name, slug, description, image,
  isActive, sortOrder, createdAt, updatedAt
}
```
**Ejemplos:** Yerba Mate, Yuyos, Mates, Yerberas

#### 2. **products** - Productos base
```typescript
{
  id, name, slug, description, longDescription,
  categoryId, brand, origin, type, images,
  status, isFeatured, tags, seoTitle, seoDescription,
  createdAt, updatedAt
}
```
**Ejemplos:** Yerba Xanaes, Yerba Amanda, Yuyo Cedrón

#### 3. **product_variants** - Variantes por peso
```typescript
{
  id, productId, name, weight, unit,
  price, cost, sku, barcode,
  isActive, sortOrder, createdAt, updatedAt
}
```
**Ejemplos:** 0.5kg, 1kg, 2kg, 3kg

#### 4. **inventory** - Control de stock
```typescript
{
  id, variantId,
  stockQuantity, reservedQuantity, availableQuantity,
  minStockLevel, maxStockLevel, lastRestocked,
  location, notes, createdAt, updatedAt
}
```

#### 5. **stock_movements** - Historial de movimientos
```typescript
{
  id, variantId, type, quantity,
  previousStock, newStock, reason,
  referenceId, referenceType, notes,
  createdBy, createdAt
}
```
**Tipos:** 'in', 'out', 'adjustment', 'transfer'

#### 6. **customers** - Clientes (invitados y registrados)
```typescript
{
  id, customerType, clerkUserId, // 'guest' o 'registered'
  email, phone, firstName, lastName, fullName,
  dateOfBirth, gender, avatar,
  isActive, isVerified, preferences,
  
  // Sistema de puntos (solo registrados)
  loyaltyPoints, loyaltyTier, // 'bronce', 'plata', 'oro'
  
  // Estadísticas
  totalOrders, totalSpent, lastOrderDate,
  notes, createdAt, updatedAt
}
```

#### 7. **customer_addresses** - Direcciones
```typescript
{
  id, customerId, type, isDefault,
  street, number, floor, apartment,
  neighborhood, city, state, postalCode, country,
  instructions, isActive, createdAt, updatedAt
}
```

#### 8. **orders** - Pedidos
```typescript
{
  id, orderNumber, customerId, status, channel,
  customerName, customerEmail, customerPhone,
  shippingAddress, subtotal, shippingCost, discount, total,
  paymentMethod, paymentStatus, paymentReference,
  shippingMethod, trackingNumber,
  estimatedDelivery, deliveredAt,
  notes, internalNotes,
  createdAt, updatedAt, confirmedAt, shippedAt
}
```
**Canales:** 'online', 'whatsapp', 'instagram', 'presencial'
**Estados:** 'pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'

#### 9. **order_items** - Items de pedidos
```typescript
{
  id, orderId, variantId,
  productName, variantName,
  quantity, unitPrice, totalPrice,
  createdAt
}
```

#### 10. **loyalty_transactions** - Movimientos de puntos
```typescript
{
  id, customerId, orderId,
  points, type, reason,
  previousBalance, newBalance,
  expiresAt, createdAt
}
```
**Tipos:** 'earned', 'redeemed', 'expired', 'bonus', 'adjustment'

#### 11. **loyalty_rewards** - Recompensas canjeables
```typescript
{
  id, name, description, pointsCost,
  discountType, discountValue, minPurchaseAmount,
  maxUses, usedCount, isActive,
  validFrom, validUntil, createdAt, updatedAt
}
```
**Tipos de descuento:** 'percentage', 'fixed', 'free_shipping'

#### 12. **loyalty_redemptions** - Canjes de puntos
```typescript
{
  id, customerId, rewardId, orderId,
  pointsUsed, status, usedAt, expiresAt,
  createdAt
}
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Admin (Clerk - Obligatorio)
- Autenticación con Clerk
- Middleware protege rutas `/dashboard/*`
- Solo usuarios admin pueden acceder

### Clientes (Clerk - Opcional)
- **Invitados:** Compran sin cuenta
- **Registrados:** Opcionalmente crean cuenta para beneficios

---

## 💳 SISTEMA DE COMPRA

### Flujo para Invitados (Guest Checkout):
```
1. Navegar catálogo → 2. Agregar al carrito → 
3. Ir a checkout → 4. Ingresar datos (email, nombre, teléfono, dirección) →
5. Seleccionar pago → 6. Confirmar compra
```

### Flujo para Registrados:
```
1. Iniciar sesión (opcional) → 2. Navegar catálogo → 
3. Agregar al carrito → 4. Ir a checkout →
5. Usar dirección guardada → 6. Aplicar puntos (si tiene) →
7. Seleccionar pago → 8. Confirmar compra → 9. GANAR PUNTOS
```

---

## ⭐ SISTEMA DE PUNTOS/FIDELIDAD

### Reglas de Acumulación:
- **Por cada $100 gastados = 10 puntos**
- Solo clientes registrados acumulan puntos
- Los puntos pueden tener fecha de expiración (opcional)

### Niveles de Fidelidad:
1. **Bronce** (0-999 puntos)
   - 5% descuento en compras
   
2. **Plata** (1000-2999 puntos)
   - 10% descuento en compras
   - Envío gratis en compras > $5000
   
3. **Oro** (3000+ puntos)
   - 15% descuento en compras
   - Envío gratis en todas las compras
   - Acceso a productos exclusivos

### Recompensas Canjeables:
- 500 puntos = 10% descuento en próxima compra
- 1000 puntos = Envío gratis
- 2000 puntos = $500 de descuento
- 5000 puntos = 1kg de yerba gratis

---

## 📊 MÉTRICAS Y ANALYTICS (Dashboard Admin)

### Métricas Clave:
- Total de productos activos
- Stock disponible vs stock bajo
- Valor total del inventario
- Ventas por canal (online, WhatsApp, Instagram, presencial)
- Clientes registrados vs invitados
- Tasa de conversión de invitados a registrados
- Productos más vendidos
- Análisis geográfico de ventas

---

## 🛍️ CANALES DE VENTA

### 1. Online (Ecommerce)
- Venta directa desde la web
- Registro automático en sistema
- Gestión automática de stock

### 2. WhatsApp
- Chat manual o bot
- Admin registra venta en dashboard
- Descuenta stock manualmente

### 3. Instagram
- DM o comentarios
- Admin registra venta en dashboard
- Descuenta stock manualmente

### 4. Presencial
- Admin registra venta en dashboard
- Descuenta stock en tiempo real
- Opción de imprimir ticket

---

## 🚀 PRÓXIMOS PASOS DE IMPLEMENTACIÓN

### FASE 1: COMPLETADA ✅
- [x] Base de datos configurada
- [x] Dashboard admin con métricas
- [x] Gestión de productos
- [x] Sistema de inventario

### FASE 2: ECOMMERCE PÚBLICO (Próximo)
- [ ] Tienda pública (catálogo)
- [ ] Carrito de compras
- [ ] Guest checkout (sin registro)
- [ ] Registered checkout (con cuenta)
- [ ] Sistema de pagos (MercadoPago)
- [ ] Generación de pedidos
- [ ] Descuento automático de stock

### FASE 3: SISTEMA DE PUNTOS
- [ ] Acumulación automática de puntos
- [ ] Niveles de fidelidad
- [ ] Recompensas canjeables
- [ ] Panel de cliente para ver puntos

### FASE 4: INTEGRACIONES
- [ ] WhatsApp API
- [ ] Instagram Shopping
- [ ] Registro manual de ventas

### FASE 5: OPTIMIZACIONES
- [ ] Reportes avanzados
- [ ] Automatizaciones
- [ ] Notificaciones
- [ ] Email marketing

---

## 🎯 VENTAJAS DE ESTA ARQUITECTURA

### Para el Negocio:
✅ **Flexible:** Acepta invitados y registrados
✅ **Escalable:** Sistema de puntos incentiva registro
✅ **Multi-canal:** Unifica todas las ventas
✅ **Control total:** Inventario en tiempo real
✅ **Data-driven:** Métricas para decisiones

### Para los Clientes:
✅ **Sin fricción:** Compra rápida sin registro obligatorio
✅ **Incentivos claros:** Beneficios por registrarse
✅ **Experiencia personalizada:** Historial y recomendaciones

### Para el Desarrollo:
✅ **Modular:** Fácil agregar nuevas funcionalidades
✅ **Type-safe:** TypeScript en toda la aplicación
✅ **Mantenible:** Código organizado y documentado
✅ **Testeable:** Estructura clara para pruebas

---

## 🔧 TECNOLOGÍAS UTILIZADAS

- **Frontend:** Next.js 15 + React 19 + TypeScript
- **UI:** Shadcn/ui + Tailwind CSS 4
- **Base de Datos:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM
- **Autenticación:** Clerk
- **Pagos:** MercadoPago (próximo)
- **Deploy:** Vercel

---

**Última actualización:** Octubre 2025
**Versión del proyecto:** 0.1.0
