# 📦 Modelo de Stock en Kilogramos

## 🎯 Concepto Principal

Este sistema está diseñado específicamente para el flujo de negocio de venta de yerba mate agroecológica, donde:

1. **Compra a granel**: Se compra yerba en bolsas grandes (ej: 10kg)
2. **Stock unificado**: Se controla el stock total en **kilogramos** por cada variedad
3. **Empaquetado dinámico**: Al momento de la venta, se especifica el tamaño del paquete
4. **Descuento automático**: Se descuentan los kilogramos vendidos del stock total

## 📊 Estructura de Datos

### Productos

Cada producto representa una **variedad de yerba** (sin variantes separadas):

```typescript
{
  id: string
  name: "Yerba Despalada Fina"
  brand: "Yerbatera Local"
  pricesPerKg: {
    "0.5": 3500,  // Precio por bolsa de 0.5kg
    "1": 6500,    // Precio por bolsa de 1kg
    "2": 12000,   // Precio por bolsa de 2kg
    "3": 17000    // Precio por bolsa de 3kg
  }
  availableSizes: [0.5, 1, 2, 3]
}
```

### Inventario

El stock se maneja **exclusivamente en kilogramos**:

```typescript
{
  productId: string
  stockKg: "20.0"        // Stock total: 20kg
  reservedKg: "0.0"      // Reservado para pedidos
  availableKg: "20.0"    // Disponible para venta
  minStockKg: "5.0"      // Stock mínimo de alerta
  costPerKg: "4000.00"   // Costo por kilogramo
}
```

### Pedidos

Los items del pedido incluyen:

```typescript
{
  productId: string
  productName: "Yerba Despalada Fina"
  sizeKg: 0.5           // Tamaño del paquete
  quantity: 3           // Cantidad de bolsas
  totalKg: 1.5          // Total en kg (0.5 × 3)
  unitPrice: 3500       // Precio por bolsa
  totalPrice: 10500     // Precio total (3500 × 3)
}
```

## 🔄 Flujo de Venta

### Ejemplo Real

**Situación inicial:**
- Stock de "Yerba Despalada Fina": **20 kg**

**Venta por WhatsApp:**
- Cliente pide: 
  - 3 bolsas de 0.5kg = 1.5kg
  - 2 bolsas de 1kg = 2kg

**Resultado:**
- Total vendido: **3.5 kg**
- Stock restante: **16.5 kg**

### Código de Descuento

```typescript
// Al confirmar la venta
for (const item of orderItems) {
  const totalKg = item.sizeKg * item.quantity;  // 0.5kg × 3 = 1.5kg
  
  await updateStockKg(
    item.productId,
    -totalKg,      // Descontar 1.5kg
    'out',
    `Venta WhatsApp - Pedido ${orderNumber}`,
    orderId
  );
}
```

## 💰 Gestión de Precios

Los precios se definen **por tamaño de empaquetado**, no por kilogramo:

- **0.5kg**: $3,500 (= $7,000/kg)
- **1kg**: $6,500 (= $6,500/kg)
- **2kg**: $12,000 (= $6,000/kg)
- **3kg**: $17,000 (= $5,666/kg)

💡 **Los paquetes más grandes tienen mejor precio por kilogramo** (incentivo para el cliente).

## 🎨 Interfaz de Ventas

### Selección de Productos

```
┌─────────────────────────────────────┐
│ Producto: Yerba Despalada Fina     │
├─────────────────────────────────────┤
│ Tamaño:                             │
│  ○ 0.5kg - $3,500                   │
│  ● 1kg - $6,500                     │
│  ○ 2kg - $12,000                    │
│  ○ 3kg - $17,000                    │
├─────────────────────────────────────┤
│ Cantidad: [3] bolsas                │
│ = 3.0kg total                       │
└─────────────────────────────────────┘
```

### Carrito

```
┌──────────────────────────────────────┐
│ Carrito de Compra                   │
├──────────────────────────────────────┤
│ • Yerba Despalada Fina - 0.5kg      │
│   3 bolsas × 0.5kg = 1.5kg total    │
│   $10,500                            │
│                                      │
│ • Yerba Con Palo - 1kg               │
│   2 bolsas × 1kg = 2kg total        │
│   $12,000                            │
├──────────────────────────────────────┤
│ Items: 2                             │
│ Bolsas: 5                            │
│ Total KG: 3.5 kg                     │
│                                      │
│ TOTAL: $22,500                       │
└──────────────────────────────────────┘
```

## 📈 Métricas del Dashboard

### Nuevas Métricas

- **Stock Total**: Muestra los kilogramos totales en inventario
  - Ejemplo: `62.0 kg`

- **Productos en Stock**: Cantidad de variedades con stock disponible
  - Ejemplo: `4 productos`

- **Alertas de Stock**: Productos con stock por debajo del mínimo
  - Ejemplo: `Yerba Despalada Fina: 3.5kg / 5.0kg min`

## 🔍 Ventajas del Modelo

### ✅ Ventajas

1. **Realista**: Refleja exactamente cómo opera el negocio
2. **Simple**: No hay variantes complejas que mantener
3. **Flexible**: Se puede vender cualquier tamaño disponible sin crear stock separado
4. **Escalable**: Fácil agregar nuevos tamaños sin reestructurar
5. **Preciso**: Control exacto de kilogramos vendidos vs disponibles

### 🎯 Casos de Uso Cubiertos

- ✅ Compra de yerba a granel
- ✅ Venta en distintos tamaños
- ✅ Registro manual de ventas (WhatsApp, Instagram, presencial)
- ✅ Venta automática por tienda virtual (futuro)
- ✅ Alertas de stock bajo
- ✅ Valor total del inventario
- ✅ Historial de movimientos de stock
- ✅ Múltiples precios por producto

## 🔧 Funciones Clave

### `updateStockKg()`

Actualiza el stock en kilogramos y registra el movimiento:

```typescript
await updateStockKg(
  productId: string,
  quantityKgChange: number,  // Positivo para agregar, negativo para quitar
  type: 'in' | 'out' | 'adjustment' | 'transfer',
  reason: string,
  referenceId?: string,
  referenceType?: string,
  notes?: string
);
```

### `getAvailableSizesWithPrices()`

Obtiene los tamaños disponibles con sus precios:

```typescript
const sizes = getAvailableSizesWithPrices(product);
// Retorna: [{ size: 0.5, price: 3500 }, { size: 1, price: 6500 }, ...]
```

## 📝 Próximos Pasos

- [ ] Implementar tienda virtual para clientes finales
- [ ] Sistema de puntos de lealtad
- [ ] Reportes de ventas por período
- [ ] Gestión de proveedores
- [ ] Control de compras a granel
- [ ] Alertas automáticas de restock

---

**Fecha de Implementación**: Octubre 2025  
**Modelo**: Stock en Kilogramos (v1.0)


