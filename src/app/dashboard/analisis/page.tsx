import { getDashboardStats } from "@/lib/dashboard";

export default async function AnalyticsPage() {
  const stats = await getDashboardStats();
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Análisis</h1>
      <ul className="space-y-2">
        <li>Usuarios: {stats.summary}</li>
        <li>Ventas: {stats.sales}</li>
        <li>Productos: {stats.products}</li>
      </ul>
    </div>
  );
}

