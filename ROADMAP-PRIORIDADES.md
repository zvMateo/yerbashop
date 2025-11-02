# 🎯 ROADMAP DE PRIORIDADES - YERBASHOP

## 📌 CONTEXTO DEL NEGOCIO

**Cliente:** Emprendimiento de yerba mate agroecológica  
**Canales actuales:** Instagram, WhatsApp, Ventas presenciales  
**Objetivo:** Ecommerce + Dashboard de gestión  

**Modelo de negocio:**
- Compra yerba en bolsas de 20kg
- Empaqueta en: 0.5kg, 1kg, 2kg, 3kg
- Vende: Yerba mate, yuyos, mates, yerberas

---

## ✅ FASE 1: FUNDACIÓN (COMPLETADA)

### **1.1 Base de Datos ✅**
- [x] Configuración de Supabase
- [x] 12 tablas implementadas
- [x] Sistema de inventario
- [x] Sistema de puntos/fidelidad
- [x] Datos de ejemplo poblados

### **1.2 Dashboard Admin ✅**
- [x] Autenticación con Clerk
- [x] Página principal con métricas reales
- [x] Gestión de productos
- [x] Control de inventario
- [x] Alertas de stock bajo

**Tiempo:** ✅ Completado
**Estado:** Dashboard funcional en http://localhost:3001

---

## 🛒 FASE 2: ECOMMERCE BÁSICO (PRIORIDAD MÁXIMA)

### **2.1 Tienda Pública - Catálogo 🔴 URGENTE**
**Tiempo estimado:** 3-4 días

#### Funcionalidades:
- [ ] Página principal de tienda (`/tienda`)
- [ ] Catálogo de productos con filtros
- [ ] Detalle de producto individual
- [ ] Selector de variantes (peso)
- [ ] Mostrar stock disponible
- [ ] Sistema de carrito

**Por qué es urgente:** Sin tienda, no hay ventas online

---

### **2.2 Checkout para Invitados 🔴 URGENTE**
**Tiempo estimado:** 2-3 días

#### Funcionalidades:
- [ ] Formulario de checkout sin registro
- [ ] Captura: nombre, email, teléfono, dirección
- [ ] Validación de datos
- [ ] Resumen de pedido
- [ ] Creación de cliente "guest" automático
- [ ] Generación de número de pedido

**Por qué es urgente:** Permite ventas inmediatas sin fricción

---

### **2.3 Sistema de Pagos 🔴 URGENTE**
**Tiempo estimado:** 2-3 días

#### Funcionalidades:
- [ ] Integración con MercadoPago
- [ ] Botón de pago
- [ ] Confirmación de pago
- [ ] Webhook para actualizar estado
- [ ] Envío de email de confirmación

**Por qué es urgente:** Sin pagos no hay ecommerce funcional

---

### **2.4 Gestión Automática de Pedidos 🟡 IMPORTANTE**
**Tiempo estimado:** 2 días

#### Funcionalidades:
- [ ] Crear pedido al confirmar pago
- [ ] Descontar stock automáticamente
- [ ] Reservar stock durante checkout
- [ ] Liberar stock si expira carrito
- [ ] Notificar al admin de nuevo pedido

**Total Fase 2:** 9-12 días

---

## ⭐ FASE 3: SISTEMA DE PUNTOS (PRIORIDAD ALTA)

### **3.1 Registro de Clientes 🟡 IMPORTANTE**
**Tiempo estimado:** 2 días

#### Funcionalidades:
- [ ] Página de registro (`/registro`)
- [ ] Integración con Clerk
- [ ] Perfil de cliente
- [ ] Opción "Crear cuenta después de comprar"

---

### **3.2 Acumulación de Puntos 🟡 IMPORTANTE**
**Tiempo estimado:** 2 días

#### Funcionalidades:
- [ ] Calcular puntos por compra (10 puntos / $100)
- [ ] Registrar transacción de puntos
- [ ] Actualizar balance de cliente
- [ ] Notificar puntos ganados

---

### **3.3 Canje de Puntos 🟡 IMPORTANTE**
**Tiempo estimado:** 3 días

#### Funcionalidades:
- [ ] Catálogo de recompensas
- [ ] Aplicar recompensa en checkout
- [ ] Descontar puntos del balance
- [ ] Aplicar descuento al total

---

### **3.4 Niveles de Fidelidad 🟢 OPCIONAL**
**Tiempo estimado:** 2 días

#### Funcionalidades:
- [ ] Calcular nivel automáticamente
- [ ] Beneficios por nivel
- [ ] Notificaciones de nivel up
- [ ] Badge en cuenta

**Total Fase 3:** 9 días

---

## 📱 FASE 4: REGISTRO MANUAL DE VENTAS (PRIORIDAD ALTA)

### **4.1 Ventas Presenciales 🟡 IMPORTANTE**
**Tiempo estimado:** 3 días

#### Funcionalidades:
- [ ] Formulario de venta rápida en dashboard
- [ ] Selección de productos y variantes
- [ ] Cálculo de total
- [ ] Registro de pago (efectivo/transferencia)
- [ ] Descuento automático de stock
- [ ] Opcional: Asociar a cliente registrado
- [ ] Opcional: Imprimir ticket

---

### **4.2 Ventas por WhatsApp/Instagram 🟡 IMPORTANTE**
**Tiempo estimado:** 2 días

#### Funcionalidades:
- [ ] Formulario similar a presencial
- [ ] Indicar canal (WhatsApp/Instagram)
- [ ] Captura de datos del cliente
- [ ] Registro en sistema
- [ ] Descuento de stock

**Total Fase 4:** 5 días

---

## 📊 FASE 5: ANALYTICS Y REPORTES (PRIORIDAD MEDIA)

### **5.1 Reportes de Ventas 🟢 ÚTIL**
**Tiempo estimado:** 3 días

#### Funcionalidades:
- [ ] Gráficos de ventas por período
- [ ] Ventas por canal
- [ ] Productos más vendidos
- [ ] Análisis de rentabilidad
- [ ] Exportar a Excel/PDF

---

### **5.2 Gestión de Clientes 🟢 ÚTIL**
**Tiempo estimado:** 2 días

#### Funcionalidades:
- [ ] Lista de clientes (registrados + invitados)
- [ ] Historial de compras por cliente
- [ ] Análisis de comportamiento
- [ ] Segmentación

**Total Fase 5:** 5 días

---

## 🔮 FASE 6: INTEGRACIONES Y AUTOMATIZACIONES (PRIORIDAD BAJA)

### **6.1 WhatsApp API 🟢 OPCIONAL**
**Tiempo estimado:** 5 días
- [ ] Bot automático de consultas
- [ ] Catálogo en WhatsApp
- [ ] Confirmaciones automáticas

### **6.2 Instagram Shopping 🟢 OPCIONAL**
**Tiempo estimado:** 3 días
- [ ] Catálogo de productos
- [ ] Tags en publicaciones
- [ ] Sincronización automática

### **6.3 Notificaciones 🟢 OPCIONAL**
**Tiempo estimado:** 2 días
- [ ] Email de confirmación
- [ ] Email de envío
- [ ] Notificaciones de puntos

**Total Fase 6:** 10 días

---

## ⏰ TIMELINE TOTAL

### Mínimo Viable (MVP):
**Fases 1 + 2 + 4.1 = 18-22 días hábiles (4-5 semanas)**

Incluye:
- ✅ Dashboard admin completo
- ✅ Tienda online con checkout invitado
- ✅ Sistema de pagos
- ✅ Registro manual de ventas presenciales

### Producto Completo:
**Todas las fases = 38-40 días hábiles (8-9 semanas)**

---

## 🎯 RECOMENDACIÓN DE PRIORIDADES

### SEMANA 1-2: Ecommerce Básico
1. Tienda pública (catálogo)
2. Guest checkout
3. Sistema de pagos básico

### SEMANA 3: Ventas Manuales
4. Registro de ventas presenciales
5. Registro de ventas WhatsApp/Instagram

### SEMANA 4-5: Sistema de Puntos
6. Registro de clientes
7. Acumulación y canje de puntos
8. Niveles de fidelidad

### SEMANA 6-7: Optimizaciones
9. Reportes y analytics
10. Gestión avanzada de clientes

### SEMANA 8-9: Integraciones (Opcional)
11. WhatsApp API
12. Instagram Shopping
13. Notificaciones automáticas

---

## 💡 CONSEJOS CLAVE

### ✅ Hacer AHORA:
1. **Ecommerce básico** - Sin esto no hay ventas online
2. **Guest checkout** - Sin fricción = más conversión
3. **Ventas presenciales** - Tu clienta necesita registrar sus ventas actuales

### ⏸️ Hacer DESPUÉS:
1. **Integraciones complejas** - Son nice-to-have
2. **Automatizaciones avanzadas** - Optimizaciones cuando haya volumen
3. **Funcionalidades extra** - Solo si hay tiempo

### ⚠️ NO hacer:
1. **Over-engineering** - Mantener simple al principio
2. **Funcionalidades sin usar** - Enfocarse en lo que realmente necesita
3. **Optimizaciones prematuras** - Primero que funcione, luego optimizar

---

**¿Preguntas o ajustes al roadmap?**
