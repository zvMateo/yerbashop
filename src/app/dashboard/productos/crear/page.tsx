"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CloudinaryUpload } from "@/components/admin/cloudinary-upload";
import { toast } from "sonner";
import { IconArrowLeft, IconSave } from "@tabler/icons-react";
import Link from "next/link";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  categoryId: string;
  brand: string;
  origin: string;
  type: string;
  images: string[];
  status: string;
  isFeatured: boolean;
  availableSizes: number[];
  pricesPerKg: Record<string, number>;
  seoTitle: string;
  seoDescription: string;
}

const defaultSizes = [0.5, 1, 2, 3];
const defaultPrices = {
  "0.5": 0,
  "1": 0,
  "2": 0,
  "3": 0,
};

export default function CrearProductoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    categoryId: "",
    brand: "",
    origin: "",
    type: "",
    images: [],
    status: "draft",
    isFeatured: false,
    availableSizes: [0.5, 1, 2, 3],
    pricesPerKg: { ...defaultPrices },
    seoTitle: "",
    seoDescription: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Generar slug automáticamente
      ...(name === "name" && {
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim(),
      }),
    }));
  };

  const handleSizeChange = (size: number, checked: boolean) => {
    const newSizes = checked
      ? [...formData.availableSizes, size]
      : formData.availableSizes.filter((s) => s !== size);

    setFormData((prev) => ({
      ...prev,
      availableSizes: newSizes,
    }));
  };

  const handlePriceChange = (size: number, price: string) => {
    setFormData((prev) => ({
      ...prev,
      pricesPerKg: {
        ...prev.pricesPerKg,
        [size.toString()]: parseFloat(price) || 0,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones
      if (!formData.name || !formData.slug) {
        throw new Error("Nombre y slug son obligatorios");
      }

      if (formData.availableSizes.length === 0) {
        throw new Error("Debe seleccionar al menos un tamaño");
      }

      // Validar que todos los tamaños seleccionados tengan precio
      const sizesWithoutPrice = formData.availableSizes.filter(
        (size) =>
          !formData.pricesPerKg[size.toString()] ||
          formData.pricesPerKg[size.toString()] <= 0
      );

      if (sizesWithoutPrice.length > 0) {
        throw new Error(
          "Todos los tamaños seleccionados deben tener un precio"
        );
      }

      // Crear el producto
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear el producto");
      }

      toast.success("Producto creado exitosamente");
      router.push("/dashboard/productos");
    } catch (error: any) {
      toast.error(error.message || "Error al crear el producto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/productos"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <IconArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>
        <h1 className="text-3xl font-bold mb-2">Crear Producto</h1>
        <p className="text-muted-foreground">
          Agrega un nuevo producto a tu catálogo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>Datos principales del producto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre del producto *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Yerba Despalada Fina"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="yerba-despalada-fina"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción corta</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Breve descripción del producto"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="longDescription">Descripción completa</Label>
              <Textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                placeholder="Descripción detallada del producto"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Ej: Yerbatera Local"
                />
              </div>
              <div>
                <Label htmlFor="origin">Origen</Label>
                <Input
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  placeholder="Ej: Misiones, Argentina"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Ej: Despalada"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imágenes */}
        <Card>
          <CardHeader>
            <CardTitle>Imágenes del Producto</CardTitle>
            <CardDescription>
              Sube las imágenes del producto (máximo 5)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CloudinaryUpload
              onImagesChange={(images) =>
                setFormData((prev) => ({ ...prev, images }))
              }
              currentImages={formData.images}
              maxImages={5}
            />
          </CardContent>
        </Card>

        {/* Tamaños y precios */}
        <Card>
          <CardHeader>
            <CardTitle>Tamaños y Precios</CardTitle>
            <CardDescription>
              Configura los tamaños disponibles y sus precios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Tamaños disponibles
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {defaultSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={formData.availableSizes.includes(size)}
                      onCheckedChange={(checked) =>
                        handleSizeChange(size, checked as boolean)
                      }
                    />
                    <Label htmlFor={`size-${size}`}>{size}kg</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                Precios por tamaño
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.availableSizes.map((size) => (
                  <div key={size}>
                    <Label htmlFor={`price-${size}`} className="text-sm">
                      {size}kg
                    </Label>
                    <Input
                      id={`price-${size}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pricesPerKg[size.toString()] || ""}
                      onChange={(e) => handlePriceChange(size, e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
            <CardDescription>Opciones adicionales del producto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="isFeatured">Producto destacado</Label>
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
            <CardDescription>
              Optimización para motores de búsqueda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seoTitle">Título SEO</Label>
              <Input
                id="seoTitle"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleInputChange}
                placeholder="Título optimizado para búsquedas"
              />
            </div>
            <div>
              <Label htmlFor="seoDescription">Descripción SEO</Label>
              <Textarea
                id="seoDescription"
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleInputChange}
                placeholder="Descripción optimizada para búsquedas"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            <IconSave className="h-4 w-4 mr-2" />
            {isLoading ? "Creando..." : "Crear Producto"}
          </Button>
          <Link href="/dashboard/productos">
            <Button variant="outline">Cancelar</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
