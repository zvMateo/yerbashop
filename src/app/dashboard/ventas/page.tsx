"use client";

import { useState } from "react";

export default function VentasPage() {
  const [form, setForm] = useState({
    varietyId: "",
    size: "",
    units: "",
    precioUnitario: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            varietyId: Number(form.varietyId),
            size: Number(form.size),
            units: Number(form.units),
            precioUnitario: Number(form.precioUnitario),
          },
        ],
      }),
    });
    setForm({ varietyId: "", size: "", units: "", precioUnitario: "" });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 max-w-xs">
      <input
        name="varietyId"
        value={form.varietyId}
        onChange={handleChange}
        placeholder="Variety ID"
        className="border p-1"
      />
      <input
        name="size"
        value={form.size}
        onChange={handleChange}
        placeholder="Size"
        className="border p-1"
      />
      <input
        name="units"
        value={form.units}
        onChange={handleChange}
        placeholder="Units"
        className="border p-1"
      />
      <input
        name="precioUnitario"
        value={form.precioUnitario}
        onChange={handleChange}
        placeholder="Precio Unitario"
        className="border p-1"
      />
      <button type="submit" className="border p-1">
        Vender
      </button>
    </form>
  );
}
