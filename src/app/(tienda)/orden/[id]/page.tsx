import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconCheck,
  IconShoppingBag,
  IconMapPin,
  IconPhone,
  IconMail,
  IconHome,
} from "@tabler/icons-react";

interface OrderPageProps {
  params: {
    id: string;
  };
}

// Simulación de datos de orden (en producción vendría de la API)
async function getOrder(orderId: string) {
  // TODO: Implementar fetch real desde la API
  // Por ahora retornamos datos mock
  return {
    id: orderId,
    orderNumber: `YBS-${orderId.slice(-6).toUpperCase()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    customerName: "Juan Pérez",
    customerEmail: "juan@email.com",
    customerPhone: "+54 9 11 1234-5678",
    shippingAddress: {
      street: "Av. Colón",
      number: "1234",
      floor: "2",
      apartment: "A",
      neighborhood: "Centro",
      city: "Córdoba",
      state: "Córdoba",
      postalCode: "5000",
      country: "Argentina",
      instructions: "Timbre B, llamar antes de entregar",
    },
    items: [
      {
        id: "1",
        productName: "Yerba Despalada Fina",
        sizeKg: 1,
        quantity: 2,
        unitPrice: 6500,
        totalPrice: 13000,
        image: null,
      },
      {
        id: "2",
        productName: "Yerba Con Palo",
        sizeKg: 0.5,
        quantity: 3,
        unitPrice: 3500,
        totalPrice: 10500,
        image: null,
      },
    ],
    subtotal: 23500,
    shippingCost: 0,
    discount: 0,
    total: 23500,
    paymentMethod: "efectivo",
    channel: "online",
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-orange-600">
            Pendiente
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="default" className="bg-blue-600">
            Confirmado
          </Badge>
        );
      case "preparing":
        return (
          <Badge variant="default" className="bg-purple-600">
            Preparando
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="default" className="bg-green-600">
            Enviado
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-800">
            Entregado
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header de confirmación */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconCheck className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">¡Pedido Confirmado!</h1>
        <p className="text-muted-foreground">
          Tu pedido ha sido recibido y está siendo procesado
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información del pedido */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detalles del pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconShoppingBag className="h-5 w-5" />
                Detalles del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Número de pedido
                  </p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Método de pago
                  </p>
                  <p className="font-medium capitalize">
                    {order.paymentMethod === "efectivo"
                      ? "Efectivo al recibir"
                      : order.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Items del pedido */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.sizeKg}kg × {item.quantity} = $
                        {item.totalPrice.toLocaleString("es-AR")}
                      </p>
                    </div>
                  </div>
                ))}
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
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">
                  {order.shippingAddress.street} {order.shippingAddress.number}
                  {order.shippingAddress.floor &&
                    `, Piso ${order.shippingAddress.floor}`}
                  {order.shippingAddress.apartment &&
                    `, Depto ${order.shippingAddress.apartment}`}
                </p>
                <p>
                  {order.shippingAddress.neighborhood},{" "}
                  {order.shippingAddress.city}
                </p>
                <p>
                  {order.shippingAddress.state}, {order.shippingAddress.country}
                  {order.shippingAddress.postalCode &&
                    ` (${order.shippingAddress.postalCode})`}
                </p>
                {order.shippingAddress.instructions && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Instrucciones:</strong>{" "}
                    {order.shippingAddress.instructions}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen y próximos pasos */}
        <div className="space-y-6">
          {/* Resumen de precios */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>
                  {order.shippingCost === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    `$${order.shippingCost.toLocaleString("es-AR")}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Descuento</span>
                <span>${order.discount.toLocaleString("es-AR")}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${order.total.toLocaleString("es-AR")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Próximos pasos */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Pasos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Te contactaremos</p>
                  <p className="text-sm text-muted-foreground">
                    En las próximas 24 horas para coordinar el envío
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Preparación</p>
                  <p className="text-sm text-muted-foreground">
                    Empaquetaremos tu pedido con cuidado
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Envío</p>
                  <p className="text-sm text-muted-foreground">
                    Te notificaremos cuando esté en camino
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de contacto */}
          <Card>
            <CardHeader>
              <CardTitle>¿Necesitas ayuda?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <IconPhone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">+54 9 11 1234-5678</span>
              </div>
              <div className="flex items-center gap-3">
                <IconMail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">hola@yerbashop.com</span>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="space-y-3">
            <Link href="/tienda" className="block">
              <Button className="w-full">
                <IconShoppingBag className="h-4 w-4 mr-2" />
                Seguir Comprando
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <IconHome className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
