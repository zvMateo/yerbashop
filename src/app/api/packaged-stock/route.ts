import { NextResponse } from "next/server";
import { db } from "@/db";
import { packagedStockTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z, ZodError } from "zod";

const postSchema = z.object({
  varietyId: z.number(),
  lotId: z.number(),
  size: z.number(),
  units: z.number(),
});

const putSchema = z.object({
  id: z.number(),
  units: z.number(),
});

const deleteSchema = z.object({
  id: z.number(),
});

export async function GET() {
  try {
    const stock = await db.select().from(packagedStockTable);
    return NextResponse.json(stock);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener stock" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = postSchema.parse(await req.json());
    const [record] = await db
      .insert(packagedStockTable)
      .values(body)
      .returning();
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al crear stock" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, units } = putSchema.parse(await req.json());
    await db
      .update(packagedStockTable)
      .set({ units })
      .where(eq(packagedStockTable.id, id));
    return NextResponse.json({ id, units });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al actualizar stock" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = deleteSchema.parse(await req.json());
    await db
      .delete(packagedStockTable)
      .where(eq(packagedStockTable.id, id));
    return NextResponse.json({ id });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al eliminar stock" },
      { status: 500 },
    );
  }
}
