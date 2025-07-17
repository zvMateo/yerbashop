import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"




export interface NavItem {
    title: string;
    url: string;
    icon: React.ComponentType;
    subtitle?: string;
}

export const navMain: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Productos",
      url: "/dashboard/productos",
      icon: IconListDetails,
      subtitle: "Gestiona tus productos",
    },
    {
      title: "Análisis",
      url: "/dashboard/analisis",
      icon: IconChartBar,
      subtitle: "Estadísticas y reportes",
    },
    {
      title: "Clientes",
      url: "/dashboard/clientes",
      icon: IconFolder,
      subtitle: "Gestión de clientes",
    },
    {
      title: "Pedidos",
      url: "/dashboard/pedidos",
      icon: IconReport,
      subtitle: "Gestión de pedidos",
    },
    {
      title: "Promociones",
      url: "/dashboard/promociones",
      icon: IconFileAi,
      subtitle: "Gestión de promociones",
    },
  ]

export const navProduct: NavItem[] = [
    {
      title: "Ofertas",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Categorías",
      url: "#",
      icon: IconChartBar,
    },
  ]

export const navAnalytics: NavItem[] = [
    {
      title: "Ventas",
      url: "#",
      icon: IconFileAi,
    },
    {
      title: "Productos",
      url: "#",
      icon: IconFileDescription,
    },
    {
      title: "Geografía",
      url: "#",
      icon: IconFileWord,
    },
    {
      title: "Inventario",
      url: "#",
      icon: IconDatabase,
    },
    {
      title: "Promociones",
      url: "#",
      icon: IconCamera,
    },
  ]

export const navCustomer: NavItem[] = [
    {
      title: "Clientes",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Segmentos",
      url: "#",
      icon: IconInnerShadowTop,
    },
    {
      title: "Análisis",
      url: "#",
      icon: IconSearch,
    },
  ]

export const navOrder: NavItem[] = [
    {
      title: "Pedidos",
      url: "#",
      icon: IconReport,
    },
    {
      title: "Historial",
      url: "#",
      icon: IconFileDescription,
    },
    {
      title: "Análisis",
      url: "#",
      icon: IconChartBar,
    },
  ]

export const navPromotion: NavItem[] = [
    {
      title: "Promociones",
      url: "#",
      icon: IconFileAi,
    },
    {
      title: "Ofertas",
      url: "#",
      icon: IconFileWord,
    },
    {
      title: "Análisis",
      url: "#",
      icon: IconChartBar,
    },
  ]