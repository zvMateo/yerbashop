import React from "react";
import { ProductCard } from "./product-card";

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

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-muted aspect-square rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🧉</div>
        <h3 className="text-lg font-semibold mb-2">
          No se encontraron productos
        </h3>
        <p className="text-muted-foreground">
          Intenta ajustar los filtros o explorar otras categorías.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
