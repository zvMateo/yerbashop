"use client";

import { useEffect, useState } from "react";

interface Producto {
  id: number;
  varietyId: number;
  lotId: number;
  size: number;
  units: number;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [form, setForm] = useState({
    varietyId: "",
    lotId: "",
    size: "",
    units: "",
  });

  const load = async () => {
    const res = await fetch("/api/packaged-stock");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/packaged-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        varietyId: Number(form.varietyId),
        lotId: Number(form.lotId),
        size: Number(form.size),
        units: Number(form.units),
      }),
    });
    setForm({ varietyId: "", lotId: "", size: "", units: "" });
    load();
  };

  const remove = async (id: number) => {
    await fetch("/api/packaged-stock", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submit} className="flex flex-col gap-2 max-w-sm">
        <input
          name="varietyId"
          value={form.varietyId}
          onChange={handleChange}
          placeholder="Variedad"
          className="border p-1"
        />
        <input
          name="lotId"
          value={form.lotId}
          onChange={handleChange}
          placeholder="Lote"
          className="border p-1"
        />
        <input
          name="size"
          value={form.size}
          onChange={handleChange}
          placeholder="Tamaño (g)"
          className="border p-1"
        />
        <input
          name="units"
          value={form.units}
          onChange={handleChange}
          placeholder="Unidades"
          className="border p-1"
        />
        <button type="submit" className="border p-1">
          Agregar
        </button>
      </form>

      <ul className="flex flex-col gap-1">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-2">
            <span>
              {p.varietyId} - Lote {p.lotId} - {p.size}g x {p.units}
            </span>
            <button
              onClick={() => remove(p.id)}
              className="text-red-600 text-sm"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

