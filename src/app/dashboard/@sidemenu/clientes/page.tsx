import React from 'react';
import MainSideMenus  from "@/components/layouts/main-side";
import {navCustomer} from '@/config/side-menus';

function DashboardSideMenu() {

    return <MainSideMenus menus = {navCustomer} />

}

export default DashboardSideMenu;