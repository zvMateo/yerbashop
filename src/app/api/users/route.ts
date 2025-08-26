import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z, ZodError } from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number().int(),
  email: z.string().email(),
});

export async function GET() {
  if (!db) {
    return NextResponse.json([]);
  }
  try {
    const users = await db.select().from(usersTable);
    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = userSchema.parse(await req.json());
    if (!db) {
      return NextResponse.json(
        { error: "Base de datos no disponible" },
        { status: 503 },
      );
    }
    const [user] = await db.insert(usersTable).values(data).returning();
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = z.object({ id: z.number() }).parse(await req.json());
    if (!db) {
      return NextResponse.json(
        { error: "Base de datos no disponible" },
        { status: 503 },
      );
    }
    await db.delete(usersTable).where(eq(usersTable.id, id));
    return NextResponse.json({ id });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 },
    );
  }
}

