import React from "react";
import { getAllProducts } from "@/lib/database/products";
import { getAvailableSizesWithPrices } from "@/lib/database/products";
import SalesForm from "./sales-form";

async function VentasPage() {
  // Obtener todos los productos con stock en KG
  const productsData = await getAllProducts();

  // Formatear productos con sus tamaños y precios
  const products = productsData.map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand || "",
    stockKg: parseFloat(product.inventory?.stockKg || "0"),
    availableKg: parseFloat(product.inventory?.availableKg || "0"),
    sizes: getAvailableSizesWithPrices(product),
  }));

  return <SalesForm products={products} />;
}

export default VentasPage;
