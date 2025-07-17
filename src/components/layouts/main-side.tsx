import React from 'react';
import type { NavItem } from '@/config/side-menus';
import Link from 'next/link';
import { SidebarGroupLabel } from "@/components/ui/sidebar";


import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


function MainSideMenus({menus}:{menus: NavItem[]}) {
    return menus.map((item) => (
          <SidebarGroupLabel key={item.subtitle}>
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url} className="flex items-center gap-2">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupLabel>

          ))
}

export default MainSideMenus;
