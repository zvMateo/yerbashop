"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/hooks/use-cart";
import {
  IconMinus,
  IconPlus,
  IconTrash,
  IconPackage,
} from "@tabler/icons-react";

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (
    productId: string,
    sizeKg: number,
    quantity: number
  ) => void;
  onRemove: (productId: string, sizeKg: number) => void;
}

export function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 0) return;
    onUpdateQuantity(item.productId, item.sizeKg, newQuantity);
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      {/* Imagen del producto */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.productName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconPackage className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-2">{item.productName}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {item.sizeKg}kg
          </Badge>
        </div>
      </div>

      {/* Cantidad */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(item.quantity - 1)}
        >
          <IconMinus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          <IconPlus className="h-4 w-4" />
        </Button>
      </div>

      {/* Precio */}
      <div className="text-right min-w-0">
        <div className="font-medium">
          ${(item.price * item.quantity).toLocaleString("es-AR")}
        </div>
        <div className="text-sm text-muted-foreground">
          ${item.price.toLocaleString("es-AR")} c/u
        </div>
      </div>

      {/* Botón eliminar */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={() => onRemove(item.productId, item.sizeKg)}
      >
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  );
}
