"use client";

import { useEffect, useState } from "react";

interface Promotion {
  id: number;
  title: string;
  discount: number;
}

export default function PromotionPage() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [form, setForm] = useState({ title: "", discount: "" });

  const load = async () => {
    const res = await fetch("/api/promotions");
    const data = await res.json();
    setPromos(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        discount: Number(form.discount),
      }),
    });
    setForm({ title: "", discount: "" });
    load();
  };

  const remove = async (id: number) => {
    await fetch("/api/promotions", {
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
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          className="border p-1"
        />
        <input
          name="discount"
          value={form.discount}
          onChange={handleChange}
          placeholder="Descuento %"
          className="border p-1"
        />
        <button type="submit" className="border p-1">
          Crear
        </button>
      </form>
      <ul className="flex flex-col gap-1">
        {promos.map((p) => (
          <li key={p.id} className="flex items-center gap-2">
            <span>
              {p.title} - {p.discount}%
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

