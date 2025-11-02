"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconUser,
  IconShoppingBag,
  IconLogout,
  IconArrowLeft,
  IconStar,
} from "@tabler/icons-react";

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <IconArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu cuenta y revisa tu actividad
        </p>
      </div>

      {/* Información del usuario */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Nombre completo</h3>
              <p className="text-muted-foreground">{session?.user?.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">{session?.user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Cliente Registrado</Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <IconStar className="h-3 w-3" />
                Nivel Bronce
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Puntos de lealtad */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconStar className="h-5 w-5" />
            Sistema de Puntos
          </CardTitle>
          <CardDescription>
            Acumula puntos con cada compra y canjéalos por beneficios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">
                Puntos Actuales
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">
                Pedidos Realizados
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-sm text-muted-foreground">Total Gastado</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Beneficios de tu nivel:
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 5% de descuento en todas las compras</li>
              <li>• Acumulación de puntos por cada compra</li>
              <li>• Acceso a ofertas exclusivas</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Historial de pedidos */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconShoppingBag className="h-5 w-5" />
            Mis Pedidos
          </CardTitle>
          <CardDescription>
            Revisa el estado de tus pedidos anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="font-medium mb-2">Aún no tienes pedidos</h3>
            <p className="text-muted-foreground mb-4">
              Cuando realices tu primera compra, aparecerá aquí
            </p>
            <Link href="/tienda">
              <Button>Explorar Productos</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/tienda">
            <Button variant="outline" className="w-full justify-start">
              <IconShoppingBag className="h-4 w-4 mr-2" />
              Seguir Comprando
            </Button>
          </Link>

          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <IconLogout className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
