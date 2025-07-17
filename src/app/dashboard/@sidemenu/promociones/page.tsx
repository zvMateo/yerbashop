import React from 'react';
import MainSideMenus  from "@/components/layouts/main-side";
import { navPromotion } from '@/config/side-menus';

function DashboardSideMenu() {

    return <MainSideMenus menus = {navPromotion} />

}

export default DashboardSideMenu;