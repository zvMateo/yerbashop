"use client";

import { useEffect, useState } from "react";

interface Sale {
  id: number;
  fecha: string | null;
  total: string;
}

export default function OrderPage() {
  const [sales, setSales] = useState<Sale[]>([]);

  const load = async () => {
    const res = await fetch("/api/sales");
    const data = await res.json();
    setSales(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {sales.map((s) => (
        <div key={s.id} className="border p-2 rounded">
          <div>ID: {s.id}</div>
          <div>
            Fecha: {s.fecha ? new Date(s.fecha).toLocaleDateString() : "—"}
          </div>
          <div>Total: {s.total}</div>
        </div>
      ))}
    </div>
  );
}

