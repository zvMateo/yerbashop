import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"

export const authAdapter = DrizzleAdapter(db)
