import { NextResponse } from 'next/server';
import { getAllInventory, getInventoryStats, getInventoryAlerts } from '@/lib/database/inventory';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'stats') {
      const stats = await getInventoryStats();
      return NextResponse.json({ stats, success: true });
    }

    if (type === 'alerts') {
      const alerts = await getInventoryAlerts();
      return NextResponse.json({ alerts, success: true });
    }

    const inventory = await getAllInventory();
    return NextResponse.json({ inventory, success: true });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Error al obtener inventario', success: false },
      { status: 500 }
    );
  }
}
