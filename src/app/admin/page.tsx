"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldCheck, UserCheck, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const users = useQuery(api.users.list);
  const toggleAdmin = useMutation(api.users.toggleAdmin);
  const deleteUserCompletely = useAction(api.users.deleteUserCompletely);
  const router = useRouter();

  useEffect(() => {
    if (users === null) {
      router.push("/dashboard");
    }
  }, [users, router]);

  if (users === undefined || users === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8faff]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-500 font-medium">Verificando seguridad...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-slate-50 from-indigo-50 via-white to-cyan-50 py-12 px-4">
    
      <div className="max-w-5xl mx-auto">
        {/* Navegación Superior */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-800 hover:text-blue-600 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Volver a Mis Tareas
          </Link>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            MODO ADMINISTRADOR
          </div>
        </div>

        {/* Tarjeta Principal (Estilo Dashboard) */}
        <div className="bg-white shadow-xl shadow-blue-900/5 border border-slate-100 p-8 md:p-10">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              Gestión de Usuarios <span className="text-blue-500">.</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Tienes {users.length} usuarios registrados en la plataforma</p>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-sm uppercase tracking-wider border-b border-slate-50">
                  <th className="px-4 py-4 text-left font-semibold">Usuario</th>
                  <th className="px-4 py-4 text-center font-semibold">Estado</th>
                  <th className="px-4 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-5">
                      <div className="font-bold text-slate-700">{user.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <button
                        onClick={() => toggleAdmin({ id: user._id, isAdmin: !user.isAdmin })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          user.isAdmin 
                            ? "bg-blue-100 text-blue-700 border border-blue-200" 
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {user.isAdmin ? <UserCheck className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        {user.isAdmin ? "ADMIN" : "ESTÁNDAR"}
                      </button>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <button 
  onClick={async () => {
    if(confirm("¿ELIMINACIÓN TOTAL? Esto borrará tareas y cuenta de Clerk.")) {
      await deleteUserCompletely({ 
        userDocId: user._id, 
        clerkUserId: user.clerkId // Asegúrate que este sea el ID de Clerk
      });
    }
  }}
>
  Eliminar Todo
</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}