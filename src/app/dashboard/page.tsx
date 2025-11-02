import React from "react";
import { auth } from "@/lib/auth";
import { getProductStats } from "@/lib/database/products";
import { getInventoryStats, getLowStockItems } from "@/lib/database/inventory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconPackage,
  IconShoppingCart,
  IconAlertTriangle,
  IconTrendingUp,
  IconArrowRight,
} from "@tabler/icons-react";

export default async function DashboardPage() {
  const session = await auth();
  const productStats = await getProductStats();
  const inventoryStats = await getInventoryStats();
  const lowStockItems = await getLowStockItems();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        {session?.user && (
          <p className="text-muted-foreground">
            Bienvenido, {session.user.name || session.user.email}
          </p>
        )}
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Productos</CardDescription>
            <CardTitle className="text-3xl">
              {productStats.totalProducts}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconPackage className="h-4 w-4" />
              <span>Variedades</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Stock Total</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {inventoryStats.totalStockKg.toFixed(1)} kg
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconPackage className="h-4 w-4" />
              <span>Kilogramos totales</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Productos en Stock</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {inventoryStats.totalWithStock}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconTrendingUp className="h-4 w-4" />
              <span>Con disponibilidad</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Alertas de Stock</CardDescription>
            <CardTitle className="text-3xl text-orange-600">
              {inventoryStats.totalLowStock}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconAlertTriangle className="h-4 w-4" />
              <span>Requiere restock</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Valor Inventario</CardDescription>
            <CardTitle className="text-3xl">
              $
              {Number(inventoryStats.totalValue).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconShoppingCart className="h-4 w-4" />
              <span>Total en stock</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Stock Bajo */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconAlertTriangle className="h-5 w-5 text-orange-600" />
                  Productos con Stock Bajo
                </CardTitle>
                <CardDescription>
                  {lowStockItems.length} producto(s) necesitan reabastecimiento
                  urgente
                </CardDescription>
              </div>
              <Link href="/dashboard/inventario">
                <Button variant="outline" size="sm">
                  Ver Inventario
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.slice(0, 5).map((item) => {
                const stockKg = parseFloat(item.stockKg);
                const minStockKg = parseFloat(item.minStockKg || "0");
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.product?.brand}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-600"
                    >
                      {stockKg.toFixed(1)}kg / {minStockKg.toFixed(1)}kg min
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Productos por Categoría */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productos por Categoría</CardTitle>
            <CardDescription>
              Distribución de productos en el catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productStats.byCategory.map((cat: any) => (
                <div
                  key={cat.categoryId}
                  className="flex justify-between items-center"
                >
                  <span className="font-medium">{cat.categoryName}</span>
                  <Badge variant="outline">{cat.productCount} productos</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Gestión de tu tienda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/productos">
              <Button variant="outline" className="w-full justify-start">
                <IconPackage className="mr-2 h-4 w-4" />
                Gestionar Productos
              </Button>
            </Link>
            <Link href="/dashboard/inventario">
              <Button variant="outline" className="w-full justify-start">
                <IconShoppingCart className="mr-2 h-4 w-4" />
                Ver Inventario
              </Button>
            </Link>
            <Link href="/dashboard/pedidos">
              <Button variant="outline" className="w-full justify-start">
                <IconTrendingUp className="mr-2 h-4 w-4" />
                Ver Pedidos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
