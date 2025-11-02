import React from "react";
import { getAllProducts } from "@/lib/database/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

async function ProductPage() {
  const products = await getAllProducts();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona tus productos de yerba mate
          </p>
        </div>
        <Link href="/dashboard/productos/crear">
          <Button>
            <IconPlus className="mr-2" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const stockKg = parseFloat(product.inventory?.stockKg || "0");
          const minStockKg = product.inventory?.minStockKg
            ? parseFloat(product.inventory.minStockKg)
            : 5;
          const isLowStock = stockKg <= minStockKg;

          return (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.brand}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      product.status === "active" ? "default" : "secondary"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>

                {/* Stock en KG */}
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm font-medium">Stock:</span>
                  <Badge
                    variant="outline"
                    className={
                      isLowStock
                        ? "text-orange-600 border-orange-600"
                        : "text-green-600 border-green-600"
                    }
                  >
                    {stockKg.toFixed(1)} kg
                  </Badge>
                </div>

                {/* Tamaños y precios */}
                {product.availableSizes && product.pricesPerKg && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Tamaños:
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {product.availableSizes.map((size: number) => {
                        const price = product.pricesPerKg![size.toString()];
                        return price ? (
                          <Badge
                            key={size}
                            variant="outline"
                            className="text-xs"
                          >
                            {size}kg: ${price}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {product.category && (
                    <Badge variant="outline">{product.category.name}</Badge>
                  )}
                  {product.origin && (
                    <Badge variant="outline">{product.origin}</Badge>
                  )}
                  {product.type && (
                    <Badge variant="outline">{product.type}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay productos creados aún</p>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
