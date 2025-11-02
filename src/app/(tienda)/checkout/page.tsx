"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { CartItemComponent } from "@/components/cart/cart-item"
import { IconArrowLeft, IconUser, IconMapPin, IconCreditCard } from "@tabler/icons-react"
import { toast } from "sonner"

interface CheckoutFormData {
  // Información del cliente
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Dirección de envío
  street: string
  number: string
  floor?: string
  apartment?: string
  neighborhood: string
  city: string
  state: string
  postalCode: string
  instructions?: string
  
  // Método de pago
  paymentMethod: string
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  // Calcular envío
  const shippingCost = totalPrice > 5000 ? 0 : 800
  const finalTotal = totalPrice + shippingCost

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    floor: "",
    apartment: "",
    neighborhood: "",
    city: "Córdoba",
    state: "Córdoba",
    postalCode: "",
    instructions: "",
    paymentMethod: "efectivo",
  })

  // Si no hay items en el carrito, redirigir
  useEffect(() => {
    if (items.length === 0) {
      router.push("/carrito")
    }
  }, [items, router])

  // Si el usuario está logueado, autocompletar algunos campos
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || session.user?.name?.split(' ')[0] || "",
        lastName: prev.lastName || session.user?.name?.split(' ').slice(1).join(' ') || "",
        email: prev.email || session.user?.email || "",
      }))
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validar datos
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        throw new Error("Completa todos los campos obligatorios")
      }

      if (!formData.street || !formData.number || !formData.neighborhood || !formData.city) {
        throw new Error("Completa la dirección de envío")
      }

      // Crear el pedido
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: {
            street: formData.street,
            number: formData.number,
            floor: formData.floor || undefined,
            apartment: formData.apartment || undefined,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: "Argentina",
            instructions: formData.instructions || undefined,
          },
          items: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            sizeKg: item.sizeKg,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
          paymentMethod: formData.paymentMethod,
          subtotal: totalPrice,
          shippingCost,
          discount: 0,
          total: finalTotal,
          channel: "online",
          notes: formData.instructions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al crear el pedido")
      }

      // Limpiar carrito
      clearCart()

      // Redirigir a confirmación
      router.push(`/orden/${data.order.id}`)

    } catch (error: any) {
      toast.error(error.message || "Error al procesar el pedido")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carrito vacío</h1>
          <p className="text-muted-foreground mb-6">No hay productos en tu carrito para procesar</p>
          <Link href="/tienda">
            <Button>Seguir Comprando</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/carrito" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <IconArrowLeft className="h-4 w-4" />
          Volver al carrito
        </Link>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Completa tu información para finalizar la compra
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="space-y-6">
            {/* Información del cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="h-5 w-5" />
                  Información de Contacto
                </CardTitle>
                <CardDescription>
                  {session ? "Información de tu cuenta" : "Completa tus datos"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dirección de envío */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconMapPin className="h-5 w-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="street">Calle *</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="floor">Piso</Label>
                    <Input
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="apartment">Depto</Label>
                    <Input
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Barrio *</Label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">Provincia *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="instructions">Instrucciones adicionales</Label>
                  <Textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    placeholder="Ej: Timbre "B", llamar antes de entregar, etc."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Método de pago */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconCreditCard className="h-5 w-5" />
                  Método de Pago
                </CardTitle>
                <CardDescription>
                  Por ahora solo aceptamos pago al recibir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="efectivo"
                      checked={formData.paymentMethod === "efectivo"}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <span>Efectivo al recibir</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={formData.paymentMethod === "transferencia"}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <span>Transferencia bancaria</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemComponent
                      key={`${item.productId}-${item.sizeKg}`}
                      item={item}
                      onUpdateQuantity={() => {}} // No permitir cambios en checkout
                      onRemove={() => {}} // No permitir eliminar en checkout
                    />
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        `$${shippingCost.toLocaleString('es-AR')}`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toLocaleString('es-AR')}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "Confirmar Pedido"}
                </Button>

                <div className="mt-4 text-xs text-muted-foreground space-y-1">
                  <p>• Te contactaremos para coordinar el envío</p>
                  <p>• Pago al recibir el producto</p>
                  <p>• Envío en 24-48hs en Córdoba</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
