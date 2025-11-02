import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { customers, accounts, sessions, verificationTokens } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos");
        }

        const user = await db.query.customers.findFirst({
          where: eq(customers.email, credentials.email),
        });

        if (!user || !user.password) {
          throw new Error("Credenciales inválidas");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Credenciales inválidas");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Para Google OAuth, crear o actualizar usuario en la base de datos
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await db.query.customers.findFirst({
            where: eq(customers.email, user.email),
          });

          if (!existingUser) {
            // Crear nuevo usuario con role 'customer'
            await db.insert(customers).values({
              email: user.email,
              fullName: user.name || "",
              firstName: user.name?.split(" ")[0] || "",
              lastName: user.name?.split(" ").slice(1).join(" ") || "",
              role: "customer",
              customerType: "registered",
              image: user.image,
              isVerified: true,
            });
          }
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        
        // Para usuarios de Google OAuth, obtener el role de la base de datos
        if (account?.provider === "google" && user.email) {
          try {
            const dbUser = await db.query.customers.findFirst({
              where: eq(customers.email, user.email),
            });
            token.role = dbUser?.role || "customer";
          } catch (error) {
            console.error("Error fetching user role:", error);
            token.role = "customer";
          }
        } else {
          token.role = user.role || "customer";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "customer";
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);