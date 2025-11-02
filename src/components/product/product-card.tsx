"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { IconShoppingCart, IconPackage } from "@tabler/icons-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
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
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const stockKg = parseFloat(product.inventory?.stockKg || "0");
  const availableKg = parseFloat(product.inventory?.availableKg || "0");
  const hasStock = availableKg > 0;

  // Obtener el precio más bajo para mostrar
  const prices = product.pricesPerKg || {};
  const lowestPrice = Math.min(...Object.values(prices));

  // Obtener el tamaño más pequeño disponible
  const smallestSize = product.availableSizes
    ? Math.min(...product.availableSizes)
    : 1;

  const handleAddToCart = () => {
    if (!hasStock) {
      toast.error("Producto sin stock");
      return;
    }

    if (!product.pricesPerKg || !smallestSize) {
      toast.error("Producto no disponible");
      return;
    }

    const price = product.pricesPerKg[smallestSize.toString()];
    if (!price) {
      toast.error("Precio no disponible");
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      sizeKg: smallestSize,
      price: price,
      image: product.images?.[0],
    });

    toast.success(`Agregado al carrito: ${product.name} (${smallestSize}kg)`);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Imagen del producto */}
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <IconPackage className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Badge de stock */}
          <div className="absolute top-2 right-2">
            {hasStock ? (
              <Badge variant="default" className="bg-green-600">
                En Stock
              </Badge>
            ) : (
              <Badge variant="destructive">Sin Stock</Badge>
            )}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-sm text-muted-foreground">{product.brand}</p>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Stock disponible */}
          <div className="flex items-center gap-2 text-sm">
            <IconPackage className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {availableKg.toFixed(1)} kg disponibles
            </span>
          </div>

          {/* Precio desde */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Desde:</span>
              <span className="text-xl font-bold text-primary ml-1">
                ${lowestPrice.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          {/* Tamaños disponibles */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {product.availableSizes.slice(0, 3).map((size) => {
                const price = product.pricesPerKg?.[size.toString()];
                return price ? (
                  <Badge key={size} variant="outline" className="text-xs">
                    {size}kg
                  </Badge>
                ) : null;
              })}
              {product.availableSizes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.availableSizes.length - 3} más
                </Badge>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            <Link href={`/producto/${product.slug}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Ver Detalle
              </Button>
            </Link>
            <Button
              onClick={handleAddToCart}
              disabled={!hasStock}
              className="flex-1"
            >
              <IconShoppingCart className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
