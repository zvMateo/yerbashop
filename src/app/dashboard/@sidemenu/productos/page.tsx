import React from 'react';
import MainSideMenus  from "@/components/layouts/main-side";
import { navProduct } from '@/config/side-menus';

function DashboardSideMenu() {

    return <MainSideMenus menus = {navProduct} />

}

export default DashboardSideMenu;