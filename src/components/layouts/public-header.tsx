"use client";

import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/cart/cart-drawer";
import {
  IconShoppingCart,
  IconUser,
  IconMenu2,
  IconLogout,
  IconLogin,
} from "@tabler/icons-react";

export function PublicHeader() {
  const { data: session } = useSession();
  const { items } = useCart();
  const cartItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">🧉</span>
              <span className="font-bold">YerbaShop</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/tienda" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Tienda
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/tienda?categoria=yerba-mate"
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Yerba Mate
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/tienda?categoria=yuyos" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Yuyos
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Carrito */}
            <CartDrawer>
              <Button variant="outline" size="icon" className="relative">
                <IconShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </CartDrawer>

            {/* Usuario */}
            {session ? (
              <div className="flex items-center space-x-2">
                <Link href="/perfil">
                  <Button variant="outline" size="sm">
                    <IconUser className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <IconLogout className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => signIn()}>
                  <IconLogin className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
                <Link href="/registro">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconMenu2 className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/tienda" className="text-lg font-medium">
                    Tienda
                  </Link>
                  <Link
                    href="/tienda?categoria=yerba-mate"
                    className="text-lg font-medium"
                  >
                    Yerba Mate
                  </Link>
                  <Link
                    href="/tienda?categoria=yuyos"
                    className="text-lg font-medium"
                  >
                    Yuyos
                  </Link>

                  <div className="pt-4 border-t">
                    <CartDrawer>
                      <button className="flex items-center space-x-2 text-lg font-medium w-full text-left">
                        <IconShoppingCart className="h-5 w-5" />
                        <span>Carrito</span>
                        {cartItemsCount > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {cartItemsCount}
                          </Badge>
                        )}
                      </button>
                    </CartDrawer>
                  </div>

                  <div className="pt-4 border-t">
                    {session ? (
                      <div className="space-y-2">
                        <Link
                          href="/perfil"
                          className="block text-lg font-medium"
                        >
                          Mi Perfil
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-0 h-auto"
                          onClick={() => signOut()}
                        >
                          <IconLogout className="h-4 w-4 mr-2" />
                          Salir
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => signIn()}
                        >
                          <IconLogin className="h-4 w-4 mr-2" />
                          Iniciar Sesión
                        </Button>
                        <Link href="/registro">
                          <Button className="w-full">Registrarse</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
