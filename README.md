# 🧉 YerbaShop - Ecommerce de Yerba Mate Agroecológica

Plataforma ecommerce con dashboard administrativo para la venta de yerba mate agroecológica, yuyos, mates y accesorios.

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 20+
- pnpm
- Cuenta de Supabase
- Cuenta de Google (para OAuth)

### Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp env.example .env.local
# Edita .env.local con tus credenciales

# Crear tablas en Supabase
pnpm run db:generate
pnpm run db:migrate

# Poblar con datos de ejemplo
pnpm run db:seed

# Iniciar servidor de desarrollo
pnpm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔐 Sistema de Autenticación Unificado

### Configuración

1. **Variables de entorno requeridas** (en `.env.local`):
```bash
# NextAuth (Sistema Unificado)
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
DATABASE_URL=your_supabase_database_url
```

2. **Crear usuario admin inicial**:
```bash
# Ejecutar script para crear admin
pnpm exec tsx scripts/create-admin.ts
```

### Flujo de Usuario

- **Visitantes**: Pueden navegar libremente por la tienda
- **Login con credenciales**: 
  - Admin → redirige a `/dashboard`
  - Cliente → redirige a `/` (tienda)
- **Login con Google**: Siempre crea/permita acceso como cliente
- **Registro**: Siempre crea usuarios como 'customer' (no admin)

## 📊 Estado Actual del Proyecto

### ✅ Completado (Fase 1)
- [x] Base de datos Supabase con 14 tablas
- [x] Dashboard admin con métricas en tiempo real
- [x] Gestión de productos y variantes
- [x] Sistema de inventario con alertas
- [x] Sistema de puntos/fidelidad (base de datos)
- [x] **Sistema de autenticación unificado (NextAuth)**

### ✅ Completado (Fase 3 - Migración Auth Unificada)
- [x] Migración de Clerk a NextAuth para admin y clientes
- [x] Sistema de roles (admin/customer) en tabla customers
- [x] OAuth con Google para clientes
- [x] Login unificado con redirección automática por role
- [x] Middleware simplificado y unificado
- [x] Script para crear usuario admin inicial

### ✅ Completado (Fase 2 - Ecommerce MVP)
- [x] Tienda pública completa (catálogo, filtros, búsqueda)
- [x] Carrito de compras con persistencia
- [x] Checkout para invitados y registrados
- [x] Sistema de autenticación de clientes (NextAuth)
- [x] Páginas de detalle de producto
- [x] Gestión de imágenes con Cloudinary
- [x] API routes completas para checkout
- [x] SEO y metadata dinámica
- [x] Responsive design

### 🔄 En Desarrollo
- [ ] Sistema de pagos (MercadoPago)
- [ ] Sistema de puntos/fidelidad completo
- [ ] Notificaciones por email

## 🏗️ Arquitectura

### Roles
- **Admin:** Dashboard completo para gestión
- **Cliente Invitado:** Compra sin registro (no acumula puntos)
- **Cliente Registrado:** Compra con cuenta (acumula puntos y beneficios)

### Stack Tecnológico
- **Framework:** Next.js 15.3.5 con App Router
- **Lenguaje:** TypeScript 5
- **UI:** Shadcn/ui + Tailwind CSS 4
- **Base de Datos:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM
- **Autenticación:** Clerk
- **Deploy:** Vercel

## 📁 Estructura del Proyecto

```
yerbashop/
├── src/
│   ├── app/
│   │   ├── dashboard/         # Dashboard admin
│   │   ├── (tienda)/          # Ecommerce público ✅
│   │   │   ├── page.tsx       # Home/Landing
│   │   │   ├── tienda/        # Catálogo
│   │   │   ├── producto/[slug]/ # Detalle producto
│   │   │   ├── carrito/       # Carrito
│   │   │   ├── checkout/      # Checkout
│   │   │   ├── orden/[id]/    # Confirmación
│   │   │   ├── login/         # Login clientes
│   │   │   ├── registro/      # Registro clientes
│   │   │   └── perfil/        # Perfil cliente
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth
│   │   │   ├── products/      # Productos
│   │   │   ├── orders/        # Pedidos
│   │   │   └── checkout/      # Checkout
│   │   ├── sitemap.ts         # SEO
│   │   └── robots.ts          # SEO
│   ├── components/
│   │   ├── ui/                # Componentes base
│   │   ├── layouts/           # Layouts
│   │   ├── product/           # Componentes productos
│   │   ├── cart/              # Componentes carrito
│   │   ├── admin/             # Componentes admin
│   │   └── providers/         # Providers (NextAuth)
│   ├── lib/
│   │   ├── database/          # Funciones de BD
│   │   ├── auth.ts            # NextAuth config
│   │   ├── cloudinary.ts      # Cloudinary config
│   │   ├── metadata.ts        # SEO metadata
│   │   └── supabase.ts        # Cliente Supabase
│   ├── store/
│   │   └── cart-store.ts      # Zustand store
│   ├── hooks/
│   │   └── use-cart.ts        # Hook carrito
│   ├── db/
│   │   ├── schema.ts          # Esquemas de BD
│   │   └── index.ts           # Cliente Drizzle
│   └── config/                # Configuración
├── scripts/
│   ├── seed-simple.ts         # Poblar BD
│   ├── test-connection.ts     # Test de conexión
│   └── check-data.ts          # Verificar datos
└── drizzle/                   # Migraciones
```

## 🗄️ Base de Datos

### Tablas Principales
- `categories` - Categorías de productos
- `products` - Productos base
- `product_variants` - Variantes (0.5kg, 1kg, 2kg, 3kg)
- `inventory` - Control de stock
- `stock_movements` - Historial de movimientos
- `customers` - Clientes (invitados + registrados)
- `orders` - Pedidos
- `order_items` - Items de pedidos
- `loyalty_transactions` - Movimientos de puntos
- `loyalty_rewards` - Recompensas
- `loyalty_redemptions` - Canjes

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm run dev              # Servidor de desarrollo

# Base de datos
pnpm run db:generate      # Generar migraciones
pnpm run db:migrate       # Ejecutar migraciones
pnpm run db:seed          # Poblar con datos de ejemplo
pnpm run db:test          # Probar conexión
pnpm run db:check         # Verificar datos
pnpm run db:studio        # Abrir Drizzle Studio

# Producción
pnpm run build            # Build para producción
pnpm run start            # Servidor de producción
pnpm run lint             # Linter
```

## 🎯 Roadmap

Ver documentos detallados:
- `ARQUITECTURA-YERBASHOP.md` - Arquitectura completa del sistema
- `ROADMAP-PRIORIDADES.md` - Plan de implementación por fases

## 📝 Variables de Entorno

Crea un archivo `.env.local` con:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
DATABASE_URL=postgresql://postgres.ref:password@aws-region.pooler.supabase.com:6543/postgres

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clerk_publishable_key
CLERK_SECRET_KEY=tu_clerk_secret_key
```

## 🤝 Contribuir

Este es un proyecto privado desarrollado para un cliente específico.

## 📄 Licencia

Privado - Todos los derechos reservados
