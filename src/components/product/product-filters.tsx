"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IconX } from "@tabler/icons-react";

interface ProductFiltersProps {
  searchParams: {
    categoria?: string;
    precio_min?: string;
    precio_max?: string;
    busqueda?: string;
    ordenar?: string;
  };
}

const categories = [
  { slug: "yerba-mate", name: "Yerba Mate" },
  { slug: "yuyos", name: "Yuyos" },
  { slug: "accesorios", name: "Accesorios" },
  { slug: "regalos", name: "Regalos" },
];

const sortOptions = [
  { value: "nuevos", label: "Más recientes" },
  { value: "nombre_asc", label: "Nombre A-Z" },
  { value: "nombre_desc", label: "Nombre Z-A" },
  { value: "precio_asc", label: "Precio menor a mayor" },
  { value: "precio_desc", label: "Precio mayor a menor" },
];

export function ProductFilters({ searchParams }: ProductFiltersProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(currentSearchParams.toString());

    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/tienda?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/tienda");
  };

  const hasActiveFilters = Object.values(searchParams).some(
    (value) => value && value !== ""
  );

  return (
    <div className="space-y-6">
      {/* Búsqueda */}
      <div className="space-y-2">
        <Label htmlFor="busqueda">Buscar productos</Label>
        <Input
          id="busqueda"
          placeholder="Nombre, marca, descripción..."
          value={searchParams.busqueda || ""}
          onChange={(e) => updateFilter("busqueda", e.target.value)}
        />
      </div>

      <Separator />

      {/* Categorías */}
      <div className="space-y-2">
        <Label>Categoría</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.slug}
              variant={
                searchParams.categoria === category.slug ? "default" : "ghost"
              }
              size="sm"
              className="w-full justify-start"
              onClick={() =>
                updateFilter(
                  "categoria",
                  searchParams.categoria === category.slug
                    ? null
                    : category.slug
                )
              }
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rango de precios */}
      <div className="space-y-2">
        <Label>Rango de precios</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="precio_min" className="text-xs">
              Mínimo
            </Label>
            <Input
              id="precio_min"
              type="number"
              placeholder="0"
              value={searchParams.precio_min || ""}
              onChange={(e) => updateFilter("precio_min", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="precio_max" className="text-xs">
              Máximo
            </Label>
            <Input
              id="precio_max"
              type="number"
              placeholder="9999"
              value={searchParams.precio_max || ""}
              onChange={(e) => updateFilter("precio_max", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Ordenar */}
      <div className="space-y-2">
        <Label>Ordenar por</Label>
        <Select
          value={searchParams.ordenar || "nuevos"}
          onValueChange={(value) => updateFilter("ordenar", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Limpiar filtros */}
      {hasActiveFilters && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label>Filtros activos</Label>
            <div className="flex flex-wrap gap-2">
              {searchParams.categoria && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {
                    categories.find((c) => c.slug === searchParams.categoria)
                      ?.name
                  }
                  <IconX
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter("categoria", null)}
                  />
                </Badge>
              )}
              {searchParams.precio_min && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Desde ${searchParams.precio_min}
                  <IconX
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter("precio_min", null)}
                  />
                </Badge>
              )}
              {searchParams.precio_max && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Hasta ${searchParams.precio_max}
                  <IconX
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter("precio_max", null)}
                  />
                </Badge>
              )}
              {searchParams.busqueda && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  "{searchParams.busqueda}"
                  <IconX
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter("busqueda", null)}
                  />
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="w-full"
            >
              Limpiar todos los filtros
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
