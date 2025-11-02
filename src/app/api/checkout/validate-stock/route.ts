import { NextResponse } from 'next/server'
import { db } from '@/db'
import { inventory, products } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface StockValidationRequest {
  items: Array<{
    productId: string
    sizeKg: number
    quantity: number
  }>
}

export async function POST(request: Request) {
  try {
    const body: StockValidationRequest = await request.json()
    const { items } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay items para validar' },
        { status: 400 }
      )
    }

    const validationResults = []

    for (const item of items) {
      // Obtener el inventario del producto
      const inventoryRecord = await db
        .select()
        .from(inventory)
        .innerJoin(products, eq(inventory.productId, products.id))
        .where(eq(inventory.productId, item.productId))
        .limit(1)

      if (inventoryRecord.length === 0) {
        validationResults.push({
          productId: item.productId,
          isValid: false,
          error: 'Producto no encontrado'
        })
        continue
      }

      const { inventory: inv, products: product } = inventoryRecord[0]
      const totalKgNeeded = item.sizeKg * item.quantity
      const availableKg = parseFloat(inv.availableKg || '0')

      if (totalKgNeeded > availableKg) {
        validationResults.push({
          productId: item.productId,
          productName: product.name,
          sizeKg: item.sizeKg,
          quantity: item.quantity,
          totalKgNeeded,
          availableKg,
          isValid: false,
          error: `Stock insuficiente. Disponible: ${availableKg}kg, necesario: ${totalKgNeeded}kg`
        })
      } else {
        validationResults.push({
          productId: item.productId,
          productName: product.name,
          sizeKg: item.sizeKg,
          quantity: item.quantity,
          totalKgNeeded,
          availableKg,
          isValid: true
        })
      }
    }

    const allValid = validationResults.every(result => result.isValid)

    return NextResponse.json({
      success: allValid,
      results: validationResults,
      message: allValid ? 'Stock disponible para todos los productos' : 'Algunos productos no tienen stock suficiente'
    })

  } catch (error: any) {
    console.error('Error validating stock:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
