import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  salesTable,
  saleItemsTable,
  packagedStockTable,
  lotsTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z, ZodError } from "zod";

const saleItemSchema = z.object({
  varietyId: z.number(),
  size: z.number(),
  units: z.number(),
  precioUnitario: z.number(),
});

const saleSchema = z.object({
  fecha: z.string().optional(),
  items: z.array(saleItemSchema),
});

export async function GET() {
  if (!db) {
    return NextResponse.json([]);
  }
  try {
    const sales = await db.select().from(salesTable);
    return NextResponse.json(sales);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener ventas" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { items, fecha } = saleSchema.parse(await req.json());
    if (!db) {
      return NextResponse.json(
        { error: "Base de datos no disponible" },
        { status: 503 },
      );
    }
    const parsedFecha = fecha ? new Date(fecha) : undefined;
    const total = items.reduce(
      (sum, i) => sum + Number(i.precioUnitario) * Number(i.units),
      0,
    );
    const [sale] = await db
      .insert(salesTable)
      .values({ fecha: parsedFecha, total: total.toString() })
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
          const newWeight =
            Number(lot.remainingWeight) - item.units * item.size;
          await db
            .update(lotsTable)
            .set({ remainingWeight: newWeight.toString() })
            .where(eq(lotsTable.id, lot.id));
        }
      }
    }
    return NextResponse.json({ id: sale.id }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al registrar venta" },
      { status: 500 },
    );
  }
}
