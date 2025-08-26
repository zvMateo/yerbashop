import { NextResponse } from "next/server";
import { db } from "@/db";
import { packagedStockTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const stock = await db.select().from(packagedStockTable);
  return NextResponse.json(stock);
}

export async function POST(req: Request) {
  const body = await req.json();
  const [record] = await db.insert(packagedStockTable).values(body).returning();
  return NextResponse.json(record);
}

export async function PUT(req: Request) {
  const { id, units } = await req.json();
  await db
    .update(packagedStockTable)
    .set({ units })
    .where(eq(packagedStockTable.id, id));
  return NextResponse.json({ id, units });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await db.delete(packagedStockTable).where(eq(packagedStockTable.id, id));
  return NextResponse.json({ id });
}
