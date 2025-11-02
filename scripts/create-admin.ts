import "dotenv/config";
import { db } from "@/db";
import { customers } from "@/db/schema";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yerbashop.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  try {
    // Verificar si ya existe un admin
    const existingAdmin = await db.query.customers.findFirst({
      where: (customer, { eq, and }) => 
        and(eq(customer.email, adminEmail), eq(customer.role, "admin")),
    });

    if (existingAdmin) {
      console.log("✅ Admin ya existe:", adminEmail);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [newAdmin] = await db.insert(customers).values({
      email: adminEmail,
      password: hashedPassword,
      fullName: "Administrador",
      firstName: "Admin",
      lastName: "YerbaShop",
      role: "admin",
      customerType: "registered",
      isVerified: true,
      isActive: true,
      phone: "+54 9 11 0000-0000",
    }).returning();

    console.log("✅ Admin creado exitosamente:");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Contraseña:", adminPassword);
    console.log("🆔 ID:", newAdmin.id);
    console.log("\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login");
  } catch (error) {
    console.error("❌ Error creando admin:", error);
  }
}

createAdmin();
