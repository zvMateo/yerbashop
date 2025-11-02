import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(req: NextRequest) {
  // Solo aplicar middleware a rutas específicas
  const { pathname } = req.nextUrl;
  
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/perfil") ||
    pathname === "/login"
  ) {
    const session = await auth();
    const isAdminRoute = pathname.startsWith("/dashboard");
    const isLoginPage = pathname === "/login";
    const isProtectedRoute = pathname.startsWith("/perfil");

    // Si es ruta de admin y no tiene role admin, redirigir a home
    if (isAdminRoute) {
      if (!session || session.user.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Si es ruta protegida de cliente y no está autenticado, redirigir a login
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Si está autenticado e intenta acceder a login, redirigir según role
    if (isLoginPage && session) {
      if (session.user.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/perfil/:path*",
    "/login",
  ],
};