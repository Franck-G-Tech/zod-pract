"use client";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import TodoForm from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
interface CMSConfig {
  successMessage?: string;
  cancelMessage?: string;
  limitMessage?: string;
  taskLimit: number;
}
export default function Home() {
  const [cmsConfig, setCmsConfig] = useState<CMSConfig | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const todos = useQuery(api.tasks.get, isAuthenticated ? {} : "skip");
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const storeUser = useMutation(api.users.storeUser);
  const users = useQuery(api.users.list, isAuthenticated ? {} : "skip");
  const userProfile = useQuery(
    api.users.getMyProfile,
    isAuthenticated ? {} : "skip",
  );
  const isAdmin = users !== undefined && users !== null;
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  useEffect(() => {
    // Esta función se ejecuta silenciosamente al cargar la página
    const syncUser = async () => {
      try {
        await storeUser();
        console.log("Usuario sincronizado con éxito");
      } catch (error) {
        console.error("Error al sincronizar usuario:", error);
      }
    };

    syncUser();
  }, [storeUser]);
    useEffect(() => {
  const fetchConfig = async () => {
    try {
      const query = `*[_type == "siteConfig"][0]`;
      const data = await client.fetch(query);
      setCmsConfig(data);
    } finally {
      setIsLoadingConfig(false);
    }
  };
  fetchConfig();
}, []);

  if (todos === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (authLoading || isLoadingConfig) {
    return <div>Cargando autenticación...</div>;
  }

  if (!isAuthenticated) {
    return <div>Por favor, inicia sesión para ver tus tareas.</div>;
  }

  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const paymentStatus = searchParams?.get("payment");

  const messages = {
    tasklimit: cmsConfig?.taskLimit || 4,
    successPayment: cmsConfig?.successMessage || "¡Pago exitoso!",
    cancelPayment: cmsConfig?.cancelMessage || "Pago cancelado",
    limitReached:
      cmsConfig?.limitMessage || `Has alcanzado el límite de ${cmsConfig?.taskLimit || 4} tareas.`,
  };

  return (
    <main className="min-h-screen  bg-slate-50 from-indigo-50 via-white to-cyan-50 py-12 px-4">
      {paymentStatus === "success" && (
        <div
          className="max-w-7xl mx-auto mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r shadow-md animate-in fade-in slide-in-from-top-4"
          role="alert"
        >
          <p className="font-bold">¡Pago exitoso!</p>
          <p>
            Tu suscripción Pro ha sido activada. Ahora puedes crear tareas
            ilimitadas.
          </p>
        </div>
      )}
      {paymentStatus === "cancel" && (
        <div
          className="max-w-7xl mx-auto mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r shadow-md animate-in fade-in slide-in-from-top-4"
          role="alert"
        >
          <p className="font-bold">Pago cancelado</p>
          <p>El proceso de pago fue cancelado. No se han realizado cargos.</p>
        </div>
      )}

      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto w-full">
        <div className="text-3xl font-bold text-indigo-600 tracking-tighter">
          TaskMaster AI
        </div>
        {/* BOTÓN CONDICIONAL PARA ADMIN */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20 text-sm font-medium"
          >
            <ShieldCheck className="w-4 h-4" />
            Panel de Administración
          </Link>
        )}
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
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      <div className="max-w-xl mx-auto">
        {/* Card Principal */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/60 border border-white p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              Mis Tareas
            </h1>
            <p className="text-slate-500 mt-2">
              Tienes{" "}
              <span className="font-semibold text-slate-700">
                {todos.length}
              </span>{" "}
              tareas pendientes
            </p>
            {/* DEBUG INFO */}
            {userProfile && (
              <div className="mt-2 text-xs font-mono text-gray-400">
                Estado: {userProfile.subscriptionStatus || "free"}
              </div>
            )}
          </header>

          <section className="space-y-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <TodoForm
                taskLimit={messages.tasklimit}
                limitMessage={messages.limitReached}
                successMessage={messages.successPayment}
              />
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-slate-100"></div>
              </div>
            </div>

            <TodoList
              todos={todos}
              onToggle={(id) => {
                const task = todos.find((t) => t._id === id);
                if (task) {
                  updateTask({ id, completed: !task.completed });
                }
              }}
              onDelete={(id) => {
                deleteTask({ id });
              }}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
