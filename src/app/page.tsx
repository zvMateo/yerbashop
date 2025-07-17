import Image from "next/image";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function Home() {
  return (
    <>
      {/* Header de autenticación solo para la página principal */}
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <SignedOut>
          <SignInButton mode="modal">
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5b3fdb]">
                Iniciar Sesión
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5b3fdb]">
                Registrarme
              </button>
            </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-2xl font-bold">Welcome to Yerba Shop</h1>
        <p className="text-center">Your one-stop shop for all things yerba mate.</p>
        
        {/* Mostrar contenido diferente según el estado de autenticación */}
        <SignedOut>
          <div className="text-center">
            <p className="mb-4">Inicia sesión para acceder al dashboard</p>
            <SignInButton mode="modal">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                Iniciar Sesión
              </button>
            </SignInButton>
          </div>
        </SignedOut>
        
        <SignedIn>
          <div className="text-center">
            <p className="mb-4">¡Bienvenido! Ya puedes acceder al dashboard</p>
            <a 
              href="/dashboard" 
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 inline-block"
            >
              Ir al Dashboard
            </a>
          </div>
        </SignedIn>
      </div>
    </>
  );
}

