"use client";

import { useEffect, useState } from "react";

interface StockItem {
  id: number;
  varietyId: number;
  size: number;
  units: number;
}

export default function InventarioPage() {
  const [stock, setStock] = useState<StockItem[]>([]);

  const load = async () => {
    const res = await fetch("/api/packaged-stock");
    const data = await res.json();
    setStock(data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateUnits = async (id: number, units: number) => {
    await fetch("/api/packaged-stock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, units }),
    });
    load();
  };

  return (
    <div className="flex flex-col gap-2">
      {stock.map((s) => (
        <div key={s.id} className="flex items-center gap-2">
          <span>
            {s.varietyId} - {s.size}g
          </span>
          <input
            type="number"
            defaultValue={s.units}
            onBlur={(e) => updateUnits(s.id, Number(e.target.value))}
            className="border p-1 w-20"
          />
        </div>
      ))}
    </div>
  );
}
