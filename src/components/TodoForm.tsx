"use client";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { todoSchema } from "@/schemas/todo.schema";
import { useState } from "react";

interface TodoFormProps {
  limitMessage?: string;
  successMessage?: string;
  taskLimit?: number;
}

export default function TodoForm({
  limitMessage,
  successMessage,
  taskLimit = 2,
}: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const createTask = useMutation(api.tasks.create);
  const pay = useAction(api.stripe.pay);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const checkoutUrl = await pay();
      if (checkoutUrl) window.location.href = checkoutUrl;
    } catch (err: unknown) {
      setError(
        "No se pudo conectar con Stripe. Intenta de nuevo." +
          (err instanceof Error ? err.message : "Error desconocido"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowUpgrade(false);

    const result = todoSchema.safeParse({ title });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setIsLoading(true);
      await createTask({ title: title.trim(), taskLimit: taskLimit });
      setTitle("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "";

      if (errorMessage.includes("LIMIT_REACHED")) {
        setError(
          limitMessage ||
            `Has alcanzado el límite de ${taskLimit} tareas.`,
        );
        setShowUpgrade(true);
      } else {
        setError("Hubo un error al guardar la tarea: " + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="¿Qué hay que hacer hoy?"
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none
                                ${
                                  error
                                    ? "border-red-200 bg-red-50 text-red-900 focus:border-red-400"
                                    : "border-slate-100 bg-white text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                } disabled:opacity-50`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold 
                                 hover:bg-blue-700 active:scale-95 transition-all 
                                 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-blue-200"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Agregar"
            )}
          </button>
        </div>

        {/* Contenedor de error con animación simple */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1  justify-center">
            <span className="ml-2">{error}</span>
          </div>
        )}
        {showSuccess && successMessage && (
          <div className="flex items-center gap-2 text-green-500 text-sm font-medium animate-in fade-in slide-in-from-top-1 justify-center">
            <span className="ml-2">{successMessage}</span>
          </div>
        )}
        {showUpgrade && (
          <button
            type="button"
            onClick={handleUpgrade}
            className="bg-linear-to-br from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md active:scale-95"
          >
            ✨ ¡Subir a Plan Pro por $5 USD!
          </button>
        )}
      </form>
    </section>
  );
}
