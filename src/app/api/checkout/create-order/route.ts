import { NextResponse } from 'next/server'
import { db } from '@/db'
import { orders, orderItems, customers, inventory, stockMovements } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface CreateOrderRequest {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    street: string
    number: string
    floor?: string
    apartment?: string
    neighborhood: string
    city: string
    state: string
    postalCode: string
    country: string
    instructions?: string
  }
  items: Array<{
    productId: string
    productName: string
    sizeKg: number
    quantity: number
    unitPrice: number
  }>
  paymentMethod: string
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  channel?: string
  notes?: string
}

export async function POST(request: Request) {
  try {
    const body: CreateOrderRequest = await request.json()
    
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      subtotal,
      shippingCost,
      discount,
      total,
      channel = 'online',
      notes
    } = body

    // Validaciones
    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Buscar o crear cliente
    let customer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, customerEmail))
      .limit(1)

    let customerId: string

    if (customer.length === 0) {
      // Crear cliente guest
      const newCustomer = await db.insert(customers).values({
        customerType: 'guest',
        email: customerEmail,
        phone: customerPhone,
        firstName: customerName.split(' ')[0],
        lastName: customerName.split(' ').slice(1).join(' '),
        fullName: customerName,
        isActive: true,
        isVerified: false,
        loyaltyPoints: 0,
        loyaltyTier: 'bronce',
        totalOrders: 0,
        totalSpent: '0',
      }).returning()
      
      customerId = newCustomer[0].id
    } else {
      customerId = customer[0].id
    }

    // Generar número de pedido único
    const orderNumber = `YBS-${Date.now().toString().slice(-6)}`

    // Crear el pedido
    const newOrder = await db.insert(orders).values({
      orderNumber,
      customerId,
      status: 'pending',
      channel: channel as any,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      subtotal: subtotal.toString(),
      shippingCost: shippingCost.toString(),
      discount: discount.toString(),
      total: total.toString(),
      paymentMethod,
      paymentStatus: 'pending',
      shippingMethod: 'standard',
      notes,
    }).returning()

    const orderId = newOrder[0].id

    // Crear items del pedido y actualizar stock
    for (const item of items) {
      // Crear item del pedido
      await db.insert(orderItems).values({
        orderId,
        productId: item.productId,
        productName: item.productName,
        sizeKg: item.sizeKg.toString(),
        quantity: item.quantity,
        totalKg: (item.sizeKg * item.quantity).toString(),
        unitPrice: item.unitPrice.toString(),
        totalPrice: (item.unitPrice * item.quantity).toString(),
      })

      // Actualizar stock
      const totalKgToSubtract = item.sizeKg * item.quantity
      
      // Obtener inventario actual
      const currentInventory = await db
        .select()
        .from(inventory)
        .where(eq(inventory.productId, item.productId))
        .limit(1)

      if (currentInventory.length > 0) {
        const currentStock = parseFloat(currentInventory[0].stockKg)
        const currentAvailable = parseFloat(currentInventory[0].availableKg)
        const newStock = currentStock - totalKgToSubtract
        const newAvailable = Math.max(0, currentAvailable - totalKgToSubtract)

        // Actualizar inventario
        await db
          .update(inventory)
          .set({
            stockKg: newStock.toString(),
            availableKg: newAvailable.toString(),
            updatedAt: new Date(),
          })
          .where(eq(inventory.productId, item.productId))

        // Registrar movimiento de stock
        await db.insert(stockMovements).values({
          productId: item.productId,
          type: 'out',
          quantityKg: totalKgToSubtract.toString(),
          previousStockKg: currentStock.toString(),
          newStockKg: newStock.toString(),
          reason: `Venta online - Pedido ${orderNumber}`,
          referenceId: orderId,
          referenceType: 'order',
          notes: `${item.quantity} × ${item.sizeKg}kg de ${item.productName}`,
        })
      }
    }

    // Actualizar estadísticas del cliente
    await db
      .update(customers)
      .set({
        totalOrders: customers.totalOrders + 1,
        totalSpent: (parseFloat(customers.totalSpent || '0') + total).toString(),
        lastOrderDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId))

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        orderNumber,
        total,
        status: 'pending'
      }
    })

  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear el pedido' },
      { status: 500 }
    )
  }
}
