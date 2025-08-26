"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/**
 * Representa un grupo dentro del menú lateral.
 * Permite renderizar un conjunto de enlaces bajo una etiqueta opcional.
 */
export interface DynamicSidebarGroupProps {
  /**
   * Etiqueta del grupo mostrada encima de los elementos.
   * Si no se proporciona, el grupo se renderiza sin título.
   */
  label?: string;
  /**
   * Elementos que se mostrarán en el grupo.
   */
  items: {
    /**
     * Texto visible del elemento.
     */
    title: string;
    /**
     * URL de destino del enlace.
     */
    url: string;
    /**
     * Icono opcional que se mostrará junto al título.
     */
    icon?: Icon;
  }[];
}

/**
 * Componente que renderiza un grupo de elementos de menú basándose en
 * la configuración proporcionada.
 */
export function DynamicSidebarGroup({ label, items }: DynamicSidebarGroupProps) {
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
