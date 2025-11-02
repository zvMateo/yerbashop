"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconShoppingCart, IconX } from "@tabler/icons-react";
import { useCart } from "@/hooks/use-cart";
import { CartItemComponent } from "./cart-item";
import { CartSummary } from "./cart-summary";

interface CartDrawerProps {
  children?: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems } = useCart();
  const [open, setOpen] = React.useState(false);

  const handleCheckout = () => {
    setOpen(false);
    // Aquí redirigiríamos al checkout
    window.location.href = "/checkout";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" className="relative">
            <IconShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <IconShoppingCart className="h-5 w-5" />
            Carrito ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <Button className="mt-4" onClick={() => setOpen(false)}>
                Seguir Comprando
              </Button>
            </div>
          ) : (
            <>
              {/* Items del carrito */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <CartItemComponent
                    key={`${item.productId}-${item.sizeKg}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* Resumen */}
              <div className="border-t pt-4">
                <CartSummary onCheckout={handleCheckout} />
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
