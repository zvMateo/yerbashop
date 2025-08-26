"use client";

import { useEffect, useState } from "react";

interface Cliente {
  id: number;
  name: string;
  age: number;
  email: string;
}

export default function CustomerPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState({ name: "", age: "", email: "" });

  const load = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setClientes(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        age: Number(form.age),
        email: form.email,
      }),
    });
    setForm({ name: "", age: "", email: "" });
    load();
  };

  const remove = async (id: number) => {
    await fetch("/api/users", {
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
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="border p-1"
        />
        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Edad"
          className="border p-1"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-1"
        />
        <button type="submit" className="border p-1">
          Agregar
        </button>
      </form>

      <ul className="flex flex-col gap-1">
        {clientes.map((c) => (
          <li key={c.id} className="flex items-center gap-2">
            <span>
              {c.name} ({c.email})
            </span>
            <button
              onClick={() => remove(c.id)}
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

