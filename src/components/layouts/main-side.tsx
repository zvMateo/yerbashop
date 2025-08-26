import React from "react";
import type { NavItem } from "@/config/side-menus";
import Link from "next/link";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

/**
 * Lista de menús principales para el sidebar.
 * Utiliza claves basadas en el título y añade etiquetas cuando existe subtítulo.
 */
function MainSideMenus({ menus }: { menus: NavItem[] }) {
  return menus.map((item) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild tooltip={item.title}>
        <Link href={item.url} className="flex items-center gap-2">
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {item.subtitle && <SidebarGroupLabel>{item.subtitle}</SidebarGroupLabel>}
    </SidebarMenuItem>
  ));
}

export default MainSideMenus;
