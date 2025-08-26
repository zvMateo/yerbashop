import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  salesTable,
  saleItemsTable,
  packagedStockTable,
  lotsTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

interface SaleItemInput {
  varietyId: number;
  size: number;
  units: number;
  precioUnitario: number;
}

export async function GET() {
  const sales = await db.select().from(salesTable);
  return NextResponse.json(sales);
}

export async function POST(req: Request) {
  const body = await req.json();
  const items: SaleItemInput[] = body.items || [];
  const fecha = body.fecha ? new Date(body.fecha) : undefined;
  const total = items.reduce(
    (sum, i) => sum + Number(i.precioUnitario) * Number(i.units),
    0,
  );
  const [sale] = await db
    .insert(salesTable)
    .values({ fecha, total: total.toString() })
    .returning();
  for (const item of items) {
    await db.insert(saleItemsTable).values({
      saleId: sale.id,
      varietyId: item.varietyId,
      size: item.size,
      units: item.units,
      precioUnitario: item.precioUnitario.toString(),
    });
    const [stock] = await db
      .select()
      .from(packagedStockTable)
      .where(
        and(
          eq(packagedStockTable.varietyId, item.varietyId),
          eq(packagedStockTable.size, item.size),
        ),
      )
      .limit(1);
    if (stock) {
      const newUnits = stock.units - item.units;
      await db
        .update(packagedStockTable)
        .set({ units: newUnits })
        .where(eq(packagedStockTable.id, stock.id));
      const [lot] = await db
        .select()
        .from(lotsTable)
        .where(eq(lotsTable.id, stock.lotId))
        .limit(1);
      if (lot) {
        const newWeight = Number(lot.remainingWeight) - item.units * item.size;
        await db
          .update(lotsTable)
          .set({ remainingWeight: newWeight.toString() })
          .where(eq(lotsTable.id, lot.id));
      }
    }
  }
  return NextResponse.json({ id: sale.id });
}
