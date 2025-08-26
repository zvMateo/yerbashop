import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

interface Promotion {
  id: number;
  title: string;
  discount: number;
}

let promotions: Promotion[] = [];

const promoSchema = z.object({
  title: z.string(),
  discount: z.number(),
});

export async function GET() {
  return NextResponse.json(promotions);
}

export async function POST(req: Request) {
  try {
    const data = promoSchema.parse(await req.json());
    const promotion: Promotion = { id: Date.now(), ...data };
    promotions.push(promotion);
    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al crear promoción" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = z.object({ id: z.number() }).parse(await req.json());
    promotions = promotions.filter((p) => p.id !== id);
    return NextResponse.json({ id });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Error al eliminar promoción" },
      { status: 500 },
    );
  }
}

