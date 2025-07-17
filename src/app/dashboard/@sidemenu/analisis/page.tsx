import React from 'react';
import MainSideMenus  from "@/components/layouts/main-side";
import {navAnalytics} from '@/config/side-menus';

function DashboardSideMenu() {

    return <MainSideMenus menus = {navAnalytics} />

}

export default DashboardSideMenu;