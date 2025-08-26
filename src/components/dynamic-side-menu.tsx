"use client";

import { type Icon } from "@tabler/icons-react";
import { DynamicSidebarGroup } from "./dynamic-sidebar-group";

/**
 * Estructura de un elemento de menú individual.
 */
export interface DynamicSideMenuItem {
  /** Texto visible del elemento. */
  title: string;
  /** URL de destino del enlace. */
  url: string;
  /** Icono opcional que se mostrará junto al título. */
  icon?: Icon;
}

/**
 * Configuración de un grupo de menú.
 */
export interface DynamicSideMenuGroup {
  /** Etiqueta opcional del grupo. */
  label?: string;
  /** Elementos que pertenecen al grupo. */
  items: DynamicSideMenuItem[];
}

/**
 * Props para `DynamicSideMenu`.
 */
export interface DynamicSideMenuProps {
  /** Conjunto de grupos a renderizar en el menú. */
  groups: DynamicSideMenuGroup[];
}

/**
 * Renderiza un menú lateral basado en una configuración dinámica de grupos.
 */
export function DynamicSideMenu({ groups }: DynamicSideMenuProps) {
  return (
    <>
      {groups.map((group, index) => (
        <DynamicSidebarGroup key={group.label ?? index} {...group} />
      ))}
    </>
  );
}
