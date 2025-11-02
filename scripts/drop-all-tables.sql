-- ========================================
-- SCRIPT PARA BORRAR TODAS LAS TABLAS
-- Ejecuta esto en Supabase SQL Editor
-- ========================================

-- Borrar tablas (en orden correcto por dependencias)
DROP TABLE IF EXISTS loyalty_redemptions CASCADE;
DROP TABLE IF EXISTS loyalty_transactions CASCADE;
DROP TABLE IF EXISTS loyalty_rewards CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customer_addresses CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Borrar enums
DROP TYPE IF EXISTS customer_type CASCADE;
DROP TYPE IF EXISTS sale_channel CASCADE;
DROP TYPE IF EXISTS stock_movement_type CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS product_status CASCADE;

-- Borrar schema de drizzle (opcional)
DROP SCHEMA IF EXISTS drizzle CASCADE;

-- Listo! Ahora la BD está limpia para empezar de cero
