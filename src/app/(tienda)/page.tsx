import React from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/database/products";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconArrowRight,
  IconLeaf,
  IconTruck,
  IconStar,
} from "@tabler/icons-react";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "YerbaShop - Yerba Mate Agroecológica de la Mejor Calidad",
  description:
    "Descubre nuestra selección de yerba mate premium, yuyos y accesorios. Productos naturales y artesanales para disfrutar el verdadero sabor del mate. Envío en 24-48hs en Córdoba.",
  keywords: [
    "yerba mate",
    "agroecológico",
    "natural",
    "mate",
    "yuyos",
    "Córdoba",
    "Argentina",
  ],
});

export default async function HomePage() {
  // Obtener productos destacados
  const allProducts = await getAllProducts();
  const featuredProducts = allProducts.filter((product) => product.isFeatured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              La mejor yerba mate
              <span className="text-green-600 block">agroecológica</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Descubre nuestra selección de yerba mate premium, yuyos y
              accesorios. Productos naturales de la mejor calidad para disfrutar
              el verdadero sabor del mate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tienda">
                <Button size="lg" className="text-lg px-8">
                  Ver Productos
                  <IconArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/tienda?categoria=yerba-mate">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Yerba Mate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <IconLeaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>100% Agroecológico</CardTitle>
                <CardDescription>
                  Productos cultivados de forma natural, sin químicos ni
                  pesticidas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <IconTruck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Envío Rápido</CardTitle>
                <CardDescription>
                  Recibe tus productos en 24-48hs en toda la ciudad
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <IconStar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Sistema de Puntos</CardTitle>
                <CardDescription>
                  Acumula puntos con cada compra y canjéalos por descuentos
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nuestra selección especial de los mejores productos para tu mate
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts.slice(0, 8)} />
          ) : (
            <ProductGrid products={allProducts.slice(0, 8)} />
          )}

          <div className="text-center mt-8">
            <Link href="/tienda">
              <Button variant="outline" size="lg">
                Ver Todos los Productos
                <IconArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestras Categorías</h2>
            <p className="text-muted-foreground">
              Explora nuestra variedad de productos naturales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/tienda?categoria=yerba-mate">
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🧉</div>
                  <h3 className="font-semibold mb-2">Yerba Mate</h3>
                  <p className="text-sm text-muted-foreground">
                    Las mejores variedades de yerba mate premium
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tienda?categoria=yuyos">
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🌿</div>
                  <h3 className="font-semibold mb-2">Yuyos</h3>
                  <p className="text-sm text-muted-foreground">
                    Hierbas naturales para infusiones y tisanas
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tienda?categoria=accesorios">
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🥤</div>
                  <h3 className="font-semibold mb-2">Accesorios</h3>
                  <p className="text-sm text-muted-foreground">
                    Mates, bombillas y todo lo que necesitas
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tienda?categoria=regalos">
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🎁</div>
                  <h3 className="font-semibold mb-2">Regalos</h3>
                  <p className="text-sm text-muted-foreground">
                    Combos y cajas regalo especiales
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de mateadores que ya eligieron YerbaShop
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tienda">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Comenzar a Comprar
              </Button>
            </Link>
            <Link href="/registro">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-white hover:bg-white hover:text-green-600"
              >
                Crear Cuenta Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
