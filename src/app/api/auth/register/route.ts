import { NextResponse } from 'next/server'
import { db } from '@/db'
import { customers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, fullName, email, phone, password } = body

    // Validaciones
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1)

    if (existingCustomer.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 400 }
      )
    }

    // Crear el cliente
    const newCustomer = await db.insert(customers).values({
      customerType: 'registered',
      firstName,
      lastName,
      fullName,
      email,
      phone,
      isActive: true,
      isVerified: false,
      loyaltyPoints: 0,
      loyaltyTier: 'bronce',
      totalOrders: 0,
      totalSpent: '0',
    }).returning()

    return NextResponse.json({
      success: true,
      customer: {
        id: newCustomer[0].id,
        email: newCustomer[0].email,
        fullName: newCustomer[0].fullName,
      }
    })

  } catch (error: any) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
