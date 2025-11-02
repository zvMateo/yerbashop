"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Evitar problemas de hidratación
  }

  return (
    <>
      {/* Header de autenticación solo para la página principal */}
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        {!session ? (
          <>
            <Link href="/login">
              <Button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5b3fdb]">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5b3fdb]">
                Registrarme
              </Button>
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hola, {session.user?.name}
            </span>
            {session.user?.role === "admin" && (
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            )}
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Cerrar Sesión
            </Button>
          </div>
        )}
      </header>

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-2xl font-bold">Welcome to Yerba Shop</h1>
        <p className="text-center">
          Your one-stop shop for all things yerba mate.
        </p>

        {/* Mostrar contenido diferente según el estado de autenticación */}
        {!session ? (
          <div className="text-center">
            <p className="mb-4">Inicia sesión para acceder al dashboard</p>
            <Link href="/login">
              <Button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">¡Bienvenido! Ya puedes acceder al dashboard</p>
            {session.user?.role === "admin" ? (
              <Link href="/dashboard">
                <Button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
                  Ir al Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/tienda">
                <Button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
                  Ir a la Tienda
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
