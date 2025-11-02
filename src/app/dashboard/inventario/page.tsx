import React from "react";
import {
  getAllInventory,
  getLowStockItems,
  getInventoryStats,
} from "@/lib/database/inventory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconAlertTriangle,
  IconPackage,
  IconTrendingUp,
} from "@tabler/icons-react";

async function InventoryPage() {
  const inventory = await getAllInventory();
  const lowStock = await getLowStockItems();
  const stats = await getInventoryStats();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventario</h1>
        <p className="text-muted-foreground">
          Control de stock y gestión de inventario
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Productos con Stock</CardDescription>
            <CardTitle className="text-3xl">{stats.totalWithStock}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconPackage className="h-4 w-4" />
              <span>Disponibles</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Stock Bajo</CardDescription>
            <CardTitle className="text-3xl text-orange-600">
              {stats.totalLowStock}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconAlertTriangle className="h-4 w-4" />
              <span>Requiere atención</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sin Stock</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {stats.totalOutOfStock}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconPackage className="h-4 w-4" />
              <span>Agotados</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Valor Total</CardDescription>
            <CardTitle className="text-3xl">
              ${Number(stats.totalValue).toLocaleString("es-AR")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconTrendingUp className="h-4 w-4" />
              <span>Inventario</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Stock Bajo */}
      {lowStock.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconAlertTriangle className="h-5 w-5 text-orange-600" />
              Productos con Stock Bajo
            </CardTitle>
            <CardDescription>
              {lowStock.length} producto(s) necesitan reabastecimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.slice(0, 5).map((item) => {
                const stockKg = parseFloat(item.stockKg);
                const minStockKg = parseFloat(item.minStockKg || "0");
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2 bg-white dark:bg-gray-900 rounded"
                  >
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.product?.brand}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-orange-600">
                      {stockKg.toFixed(1)}kg / {minStockKg.toFixed(1)}kg min
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de Inventario */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario Completo</CardTitle>
          <CardDescription>
            Todos los productos y sus niveles de stock (en kilogramos)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead className="text-right">Stock (kg)</TableHead>
                <TableHead className="text-right">Reservado (kg)</TableHead>
                <TableHead className="text-right">Disponible (kg)</TableHead>
                <TableHead className="text-right">Min. Stock (kg)</TableHead>
                <TableHead className="text-right">Costo/kg</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const stockKg = parseFloat(item.stockKg);
                const minStockKg = parseFloat(item.minStockKg || "0");
                const reservedKg = parseFloat(item.reservedKg || "0");
                const availableKg = parseFloat(item.availableKg || "0");
                const costPerKg = parseFloat(item.costPerKg || "0");

                const isLowStock = stockKg <= minStockKg;
                const isOutOfStock = stockKg === 0;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.product?.name}
                    </TableCell>
                    <TableCell>{item.product?.brand}</TableCell>
                    <TableCell className="text-right font-medium">
                      {stockKg.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {reservedKg.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {availableKg.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {minStockKg.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${costPerKg.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {isOutOfStock ? (
                        <Badge variant="destructive">Sin Stock</Badge>
                      ) : isLowStock ? (
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                        >
                          Stock Bajo
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          OK
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default InventoryPage;
