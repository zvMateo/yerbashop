import React from "react";
import { getAllProducts } from "@/lib/database/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TiendaPageProps {
  searchParams: {
    categoria?: string;
    precio_min?: string;
    precio_max?: string;
    busqueda?: string;
    ordenar?: string;
  };
}

export default async function TiendaPage({ searchParams }: TiendaPageProps) {
  const allProducts = await getAllProducts();

  // Filtrar productos activos
  let filteredProducts = allProducts.filter(
    (product) => product.status === "active"
  );

  // Aplicar filtros
  if (searchParams.categoria) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category?.slug === searchParams.categoria
    );
  }

  if (searchParams.busqueda) {
    const searchTerm = searchParams.busqueda.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm)
    );
  }

  // Filtrar por precio
  if (searchParams.precio_min || searchParams.precio_max) {
    const minPrice = parseFloat(searchParams.precio_min || "0");
    const maxPrice = parseFloat(searchParams.precio_max || "999999");

    filteredProducts = filteredProducts.filter((product) => {
      const prices = Object.values(product.pricesPerKg || {});
      if (prices.length === 0) return false;
      const lowestPrice = Math.min(...prices);
      return lowestPrice >= minPrice && lowestPrice <= maxPrice;
    });
  }

  // Ordenar productos
  if (searchParams.ordenar) {
    switch (searchParams.ordenar) {
      case "precio_asc":
        filteredProducts.sort((a, b) => {
          const priceA = Math.min(...Object.values(a.pricesPerKg || {}));
          const priceB = Math.min(...Object.values(b.pricesPerKg || {}));
          return priceA - priceB;
        });
        break;
      case "precio_desc":
        filteredProducts.sort((a, b) => {
          const priceA = Math.min(...Object.values(a.pricesPerKg || {}));
          const priceB = Math.min(...Object.values(b.pricesPerKg || {}));
          return priceB - priceA;
        });
        break;
      case "nombre_asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nombre_desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "nuevos":
        filteredProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  }

  // Estadísticas
  const totalProducts = filteredProducts.length;
  const productsWithStock = filteredProducts.filter(
    (product) => parseFloat(product.inventory?.availableKg || "0") > 0
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tienda</h1>
        <p className="text-muted-foreground">
          Descubre nuestra selección de yerba mate y productos naturales
        </p>

        {/* Estadísticas */}
        <div className="flex gap-4 mt-4">
          <Badge variant="outline" className="text-sm">
            {totalProducts} productos
          </Badge>
          <Badge variant="outline" className="text-sm">
            {productsWithStock} con stock
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtros */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Refina tu búsqueda</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductFilters searchParams={searchParams} />
            </CardContent>
          </Card>
        </div>

        {/* Productos */}
        <div className="lg:col-span-3">
          <ProductGrid products={filteredProducts} />

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧉</div>
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron productos
              </h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros o explorar otras categorías.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
