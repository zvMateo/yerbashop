import React from 'react';
import MainSideMenus  from "@/components/layouts/main-side";
import { navOrder } from '@/config/side-menus';

function DashboardSideMenu() {

    return <MainSideMenus menus = {navOrder} />

}

export default DashboardSideMenu;