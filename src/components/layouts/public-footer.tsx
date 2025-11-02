import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function PublicFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧉</span>
              <span className="font-bold text-lg">YerbaShop</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Yerba mate agroecológica de la mejor calidad. Productos naturales
              y artesanales para disfrutar el verdadero sabor del mate.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="font-semibold">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <Link
                href="/tienda"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Tienda
              </Link>
              <Link
                href="/tienda?categoria=yerba-mate"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Yerba Mate
              </Link>
              <Link
                href="/tienda?categoria=yuyos"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Yuyos
              </Link>
              <Link
                href="/tienda?categoria=accesorios"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Accesorios
              </Link>
            </div>
          </div>

          {/* Información */}
          <div className="space-y-4">
            <h3 className="font-semibold">Información</h3>
            <div className="space-y-2">
              <Link
                href="/sobre-nosotros"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/contacto"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contacto
              </Link>
              <Link
                href="/preguntas-frecuentes"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Preguntas Frecuentes
              </Link>
              <Link
                href="/politicas"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Políticas
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contacto</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📍 Córdoba, Argentina</p>
              <p>📞 +54 9 11 1234-5678</p>
              <p>✉️ hola@yerbashop.com</p>
              <p>🕒 Lun - Vie: 9:00 - 18:00</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 YerbaShop. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/politicas"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              href="/terminos"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
