"use client";

import React from "react";
import { usePathname } from "next/navigation";
import MainSideMenus from "@/components/layouts/main-side";
import {
  navAnalytics,
  navCustomer,
  navOrder,
  navProduct,
  navPromotion,
  NavItem,
} from "@/config/side-menus";

const menuMap: Record<string, NavItem[]> = {
  productos: navProduct,
  analisis: navAnalytics,
  clientes: navCustomer,
  pedidos: navOrder,
  promociones: navPromotion,
};

/**
 * Renderiza el menú contextual según la sección activa del dashboard.
 */
export default function DynamicSideMenu() {
  const pathname = usePathname();
  const section = pathname.split("/").pop() || "";
  const menus = menuMap[section] || [];
  return <MainSideMenus menus={menus} />;
}
