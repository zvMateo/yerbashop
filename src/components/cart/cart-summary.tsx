"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { IconShoppingCart } from "@tabler/icons-react";

interface CartSummaryProps {
  onCheckout: () => void;
  isLoading?: boolean;
}

export function CartSummary({ onCheckout, isLoading }: CartSummaryProps) {
  const { items, totalPrice, totalItems } = useCart();

  // Calcular envío (gratis para compras mayores a $5000)
  const shippingCost = totalPrice > 5000 ? 0 : 800;
  const finalTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconShoppingCart className="h-5 w-5" />
            Resumen del Carrito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-muted-foreground">Tu carrito está vacío</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconShoppingCart className="h-5 w-5" />
          Resumen del Carrito
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detalles de productos */}
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.sizeKg}`}
              className="flex justify-between text-sm"
            >
              <span className="flex-1 truncate">
                {item.productName} ({item.sizeKg}kg) × {item.quantity}
              </span>
              <span className="font-medium">
                ${(item.price * item.quantity).toLocaleString("es-AR")}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span>
            Subtotal ({totalItems} {totalItems === 1 ? "producto" : "productos"}
            )
          </span>
          <span className="font-medium">
            ${totalPrice.toLocaleString("es-AR")}
          </span>
        </div>

        {/* Envío */}
        <div className="flex justify-between text-sm">
          <span>Envío</span>
          <span className="font-medium">
            {shippingCost === 0 ? (
              <span className="text-green-600">Gratis</span>
            ) : (
              `$${shippingCost.toLocaleString("es-AR")}`
            )}
          </span>
        </div>

        {shippingCost > 0 && (
          <p className="text-xs text-muted-foreground">
            Envío gratis en compras mayores a $5.000
          </p>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${finalTotal.toLocaleString("es-AR")}</span>
        </div>

        {/* Botón de checkout */}
        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
          disabled={isLoading}
        >
          {isLoading ? "Procesando..." : "Proceder al Checkout"}
        </Button>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Envío en 24-48hs en Córdoba</p>
          <p>• Pago al recibir o transferencia</p>
          <p>• Te contactaremos para coordinar</p>
        </div>
      </CardContent>
    </Card>
  );
}
