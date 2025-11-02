"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";
import { IconShoppingCart, IconMinus, IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  images?: string[];
  pricesPerKg?: Record<string, number>;
  availableSizes?: number[];
  inventory?: {
    stockKg: string;
    availableKg: string;
  };
  category?: {
    name: string;
  };
  status: string;
}

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const availableKg = parseFloat(product.inventory?.availableKg || "0");
  const hasStock = availableKg > 0;

  // Obtener tamaños disponibles con precios
  const sizesWithPrices =
    product.availableSizes
      ?.map((size) => ({
        size,
        price: product.pricesPerKg?.[size.toString()] || 0,
      }))
      .filter((item) => item.price > 0) || [];

  const handleAddToCart = () => {
    if (!hasStock) {
      toast.error("Producto sin stock");
      return;
    }

    if (!selectedSize) {
      toast.error("Selecciona un tamaño");
      return;
    }

    const selectedSizeData = sizesWithPrices.find(
      (item) => item.size === selectedSize
    );
    if (!selectedSizeData) {
      toast.error("Tamaño no disponible");
      return;
    }

    // Agregar múltiples items si la cantidad es mayor a 1
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        productName: product.name,
        sizeKg: selectedSize,
        price: selectedSizeData.price,
        image: product.images?.[0],
      });
    }

    toast.success(
      `Agregado al carrito: ${product.name} (${selectedSize}kg) × ${quantity}`
    );

    // Resetear cantidad
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  return (
    <div className="space-y-6">
      {/* Selector de tamaño */}
      <div>
        <Label className="text-base font-medium mb-3 block">Tamaño</Label>
        <div className="grid grid-cols-2 gap-3">
          {sizesWithPrices.map(({ size, price }) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedSize === size
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              <div className="font-medium">{size} kg</div>
              <div className="text-lg font-bold text-primary">
                ${price.toLocaleString("es-AR")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selector de cantidad */}
      {selectedSize && (
        <div>
          <Label className="text-base font-medium mb-3 block">Cantidad</Label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <IconMinus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium text-lg">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <IconPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Precio total */}
      {selectedSize && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="text-2xl font-bold text-primary">
              $
              {(
                sizesWithPrices.find((item) => item.size === selectedSize)
                  ?.price || 0 * quantity
              ).toLocaleString("es-AR")}
            </span>
          </div>
          {quantity > 1 && (
            <div className="text-sm text-muted-foreground mt-1">
              {quantity} × $
              {sizesWithPrices
                .find((item) => item.size === selectedSize)
                ?.price.toLocaleString("es-AR")}{" "}
              c/u
            </div>
          )}
        </div>
      )}

      {/* Botón agregar al carrito */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={!hasStock || !selectedSize}
      >
        <IconShoppingCart className="h-5 w-5 mr-2" />
        {!hasStock
          ? "Sin Stock"
          : !selectedSize
          ? "Selecciona un Tamaño"
          : "Agregar al Carrito"}
      </Button>

      {/* Información de stock */}
      {!hasStock && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">
            Producto sin stock
          </p>
          <p className="text-xs text-destructive/80 mt-1">
            Contactanos para conocer la disponibilidad
          </p>
        </div>
      )}
    </div>
  );
}
