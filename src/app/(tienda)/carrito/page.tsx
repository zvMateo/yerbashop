"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { CartItemComponent } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArrowLeft, IconShoppingBag } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <IconArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <h1 className="text-3xl font-bold mb-2">Carrito de Compras</h1>
        </div>

        {/* Carrito vacío */}
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Parece que no has agregado ningún producto a tu carrito todavía.
            ¡Explora nuestra tienda y encuentra los mejores productos!
          </p>
          <Link href="/tienda">
            <Button size="lg">
              <IconShoppingBag className="h-5 w-5 mr-2" />
              Comenzar a Comprar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <IconArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>
        <h1 className="text-3xl font-bold mb-2">Carrito de Compras</h1>
        <p className="text-muted-foreground">
          Revisa tus productos antes de proceder al checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items del carrito */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos en tu carrito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <CartItemComponent
                  key={`${item.productId}-${item.sizeKg}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <CartSummary onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
}
