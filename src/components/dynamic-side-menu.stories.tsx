"use client";

import { IconHome, IconSettings } from "@tabler/icons-react";

import { DynamicSideMenu } from "./dynamic-side-menu";

/** Ejemplo de uso de `DynamicSideMenu`. */
export function ExampleDynamicSideMenu() {
  return (
    <DynamicSideMenu
      groups={[
        {
          label: "General",
          items: [
            { title: "Inicio", url: "/", icon: IconHome },
            { title: "Configuración", url: "/settings", icon: IconSettings },
          ],
        },
      ]}
    />
  );
}
