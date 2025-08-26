"use client";

import { IconHome } from "@tabler/icons-react";

import { DynamicSidebarGroup } from "./dynamic-sidebar-group";

/** Ejemplo de uso de `DynamicSidebarGroup`. */
export function ExampleSidebarGroup() {
  return (
    <DynamicSidebarGroup
      label="General"
      items={[
        { title: "Inicio", url: "/", icon: IconHome },
      ]}
    />
  );
}
