import { sql } from "drizzle-orm";
import { db } from "@/db";
import { usersTable, salesTable, packagedStockTable } from "@/db/schema";

export interface DashboardStats {
  summary: number;
  sales: number;
  products: number;
}

/**
 * Obtiene estadísticas básicas para el dashboard. Si la base de datos no está
 * configurada, devuelve valores por defecto para evitar errores en desarrollo.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  if ("select" in db) {
    const [userCount] = await db
      .select({ value: sql<number>`count(*)` })
      .from(usersTable);
    const [salesCount] = await db
      .select({ value: sql<number>`count(*)` })
      .from(salesTable);
    const [productCount] = await db
      .select({ value: sql<number>`count(*)` })
      .from(packagedStockTable);
    return {
      summary: userCount?.value ?? 0,
      sales: salesCount?.value ?? 0,
      products: productCount?.value ?? 0,
    };
  }

  // Datos por defecto en caso de no haber base de datos
  return {
    summary: 0,
    sales: 0,
    products: 0,
  };
}
