import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/database/products";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IconArrowLeft, IconPackage, IconLeaf } from "@tabler/icons-react";
import { generateProductMetadata } from "@/lib/metadata";
import { Metadata } from "next";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const products = await getAllProducts();
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: "Producto no encontrado - YerbaShop",
      description: "El producto que buscas no existe.",
    };
  }

  return generateProductMetadata(product);
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const products = await getAllProducts();
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const stockKg = parseFloat(product.inventory?.stockKg || "0");
  const availableKg = parseFloat(product.inventory?.availableKg || "0");
  const hasStock = availableKg > 0;

  // Obtener productos relacionados (misma categoría)
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.categoryId === product.categoryId &&
        p.status === "active"
    )
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <IconArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>

        <nav className="text-sm text-muted-foreground">
          <Link href="/tienda" className="hover:text-foreground">
            Tienda
          </Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/tienda?categoria=${product.category.slug}`}
                className="hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IconPackage className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.category && (
                <Badge variant="outline">{product.category.name}</Badge>
              )}
              {product.isFeatured && <Badge variant="default">Destacado</Badge>}
            </div>

            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {product.brand && (
              <p className="text-lg text-muted-foreground mb-4">
                {product.brand}
              </p>
            )}
          </div>

          {/* Stock */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <IconPackage className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {hasStock ? "En Stock" : "Sin Stock"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {availableKg.toFixed(1)} kg disponibles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descripción */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Características */}
          <div className="grid grid-cols-2 gap-4">
            {product.origin && (
              <div>
                <h4 className="font-medium text-sm">Origen</h4>
                <p className="text-sm text-muted-foreground">
                  {product.origin}
                </p>
              </div>
            )}
            {product.type && (
              <div>
                <h4 className="font-medium text-sm">Tipo</h4>
                <p className="text-sm text-muted-foreground">{product.type}</p>
              </div>
            )}
          </div>

          {/* Componente interactivo (selector de tamaño, cantidad, etc.) */}
          <ProductDetailClient product={product} />

          {/* Información adicional */}
          <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconLeaf className="h-4 w-4" />
              <span>Producto 100% agroecológico</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• Envío en 24-48hs en Córdoba</p>
              <p>• Pago al recibir o transferencia</p>
              <p>• Te contactaremos para coordinar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                    {relatedProduct.images &&
                    relatedProduct.images.length > 0 ? (
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconPackage className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium mb-2 line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {relatedProduct.availableSizes?.[0]}kg
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Desde $
                      {Math.min(
                        ...Object.values(relatedProduct.pricesPerKg || {})
                      ).toLocaleString("es-AR")}
                    </span>
                  </div>
                  <Link href={`/producto/${relatedProduct.slug}`}>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Ver Detalle
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
