import { NextResponse } from 'next/server';
import { createOrder, findOrCreateCustomer } from '@/lib/database/orders';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      channel,
      paymentMethod,
      items,
      shippingAddress,
      subtotal,
      total,
      notes,
    } = body;

    // Validaciones
    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Nombre y teléfono del cliente son obligatorios', success: false },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Debe incluir al menos un producto', success: false },
        { status: 400 }
      );
    }

    // Buscar o crear cliente
    const customer = await findOrCreateCustomer({
      fullName: customerName,
      phone: customerPhone,
      email: customerEmail || undefined,
      customerType: 'guest', // Por defecto es invitado
    });

    // Crear pedido
    const order = await createOrder({
      customerId: customer.id,
      customerName,
      customerEmail,
      customerPhone,
      channel: channel || 'presencial',
      shippingAddress: shippingAddress || {
        street: 'Retiro en local',
        number: 'S/N',
        neighborhood: 'Centro',
        city: 'Córdoba',
        state: 'Córdoba',
        postalCode: '5000',
        country: 'Argentina',
      },
      items,
      paymentMethod: paymentMethod || 'efectivo',
      shippingCost: 0,
      discount: 0,
      notes,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
    });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear el pedido', success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // TODO: Implementar getAllOrders
    return NextResponse.json({ orders: [], success: true });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error al obtener pedidos', success: false },
      { status: 500 }
    );
  }
}

