import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";
import { client } from "../sanity/lib/client";

export default async function LandingPage() {
  const query = `*[_type == "landing"][0]`;
  const data = await client.fetch(query);

  const content = {
    title: data?.title || "Organiza tu día, conquista tus metas.",
    description: data?.description || "La lista de tareas más rápida y segura. Diseñada para mantenerte enfocado con sincronización en tiempo real.",
      buttonText: data?.buttonText || "Empezar ahora — Gratis",
  };
  return (
<div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden">
  
  {/* Navbar: Se queda arriba */}
  <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto w-full">
    <div className="text-3xl font-bold text-indigo-600 tracking-tighter">TaskMaster AI</div>
    <div className="flex gap-6 items-center">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
            Iniciar Sesión
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-lg active:scale-95 font-bold">
            Registrarse
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton  />
      </SignedIn>
    </div>
  </nav>


  <main className="flex min-h-[calc(70vh-5rem)] flex-col justify-center items-center px-6 text-center">
    
    <div className="max-w-4xl w-full space-y-10">
      {/* Texto Principal */}
      <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-black text-indigo-600 tracking-tighter leading-tight">
          {content.title}
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium ">
          {content.description}
        </p>
      </div>

      {/* Botón Central */}
      <div>
        <SignedOut>
          <SignUpButton mode="modal">
            <button className="bg-indigo-600 text-white text-xl px-12 py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl hover:scale-105 active:scale-95 transform font-black">
              {content.buttonText}
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">
            <button className="bg-indigo-600 text-white text-xl px-12 py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl hover:scale-105 active:scale-95 transform font-black">
              Ir al Dashboard
            </button>
          </Link>
        </SignedIn>
      </div>

      {/* Features: Ahora con más aire y mejor distribuidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-slate-200/60">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-3xl">🔒</span>
          <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Privacidad</h3>
          <p className="text-slate-500 text-sm">Tus datos están cifrados.</p>
        </div>
        <div className="flex flex-col items-center space-y-2 border-x border-slate-200/60">
          <span className="text-3xl">⚡</span>
          <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Velocidad</h3>
          <p className="text-slate-500 text-sm">Tiempo real garantizado.</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-3xl">🎨</span>
          <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Simple</h3>
          <p className="text-slate-500 text-sm">Sin ruidos innecesarios.</p>
        </div>
      </div>
    </div>
  </main>

  {/* Footer: Empujado hasta abajo */}
  <footer className="py-8 text-center text-slate-400 text-sm font-medium">
    © 2026 TaskMaster AI — Potenciado por Convex y Clerk
  </footer>
</div>
  );
}
