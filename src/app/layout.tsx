import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YerbaXanaes",
  description: "La mejor Yerba Agroecológica de Argentina",
};

// // Componente para el header de autenticación
// function AuthHeader({ showHeader }: { showHeader: boolean }) {
//   if (!showHeader) return null;

//   return (
//     <header className="flex justify-end items-center p-4 gap-4 h-16">
//       <SignedOut>
//         <SignInButton />
//         <SignUpButton>
//           <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
//             Sign Up
//           </button>
//         </SignUpButton>
//       </SignedOut>
//       <SignedIn>
//         <UserButton />
//       </SignedIn>
//     </header>
//   );
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
