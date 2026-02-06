import { v } from "convex/values";
import { action, mutation, internalMutation } from "./_generated/server";
import {  internal } from "./_generated/api";
import { createClerkClient } from "@clerk/backend";
import { query } from "./_generated/server";
// Listar usuarios para la tabla del Admin
export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");
    const userId = identity.tokenIdentifier.split("|")[1];

    // Verificamos si el que consulta es admin en nuestra DB
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId",userId))
      .unique();

    if (!user?.isAdmin) return null;

    return await ctx.db.query("users").collect();
  },
});

export const getMyProfile = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.tokenIdentifier.split("|")[1];
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .unique();
  },
});

// La mutación para la "palomita" (isAdmin [x])
export const toggleAdmin = mutation({
  args: { id: v.id("users"), isAdmin: v.boolean() },
  handler: async (ctx, { id, isAdmin }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    // SEGURIDAD: Solo un admin puede nombrar a otro admin
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier.split("|")[1]))
      .unique();

    if (!currentUser?.isAdmin) throw new Error("Solo los administradores pueden cambiar roles");

    await ctx.db.patch(id, { isAdmin });
  },
});

export const removeUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    // 🔐 VALIDACIÓN DE SEGURIDAD
    // Buscamos al usuario que hace la petición para ver si es Admin
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier.split("|")[1]))
      .unique();

    if (!currentUser?.isAdmin) {
      throw new Error("Acceso denegado: Solo los administradores pueden eliminar usuarios");
    }

    // ❌ ELIMINACIÓN
    await ctx.db.delete(id);
  },
});

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // 1. Buscamos si ya existe por su token de Clerk
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier.split("|")[1]))
      .unique();

    if (user !== null) {
      // Si el nombre o email cambió en Clerk, lo actualizamos (opcional)
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    const userId = identity.tokenIdentifier.split("|")[1];
    // 2. Si es nuevo, lo insertamos.
    // Por seguridad, isAdmin siempre empieza en false.
    return await ctx.db.insert("users", {
      clerkId: userId,
      name: identity.name ?? "Usuario Anónimo",
      email: identity.email ?? "Sin email",
      isAdmin: false,
    });
  },
});

export const internalDelete = internalMutation({
  args: { 
    userId: v.string(),     // Recibimos el ID largo (tokenIdentifier)
    userDocId: v.id("users") 
  },
  handler: async (ctx, args) => {
    // 1. EXTRAER EL ID CORTO (user_...) para buscar en la tabla 'task'
    // Según tu captura, así es como se guardan los datos en tu DB.
    const shortUserId = args.userId.includes("|") 
      ? args.userId.split("|")[1] 
      : args.userId;

    // 2. Buscar las tareas con el ID CORTO
    const tasks = await ctx.db
      .query("task")
      .filter((q) => q.eq(q.field("userId"), shortUserId))
      .collect();
    
    // 3. Borrar cada tarea encontrada
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // 4. Borrar al usuario de la tabla 'users'
    await ctx.db.delete(args.userDocId);
    
    console.log(`Eliminación exitosa: Se borraron ${tasks.length} tareas.`);
  },
});

export const deleteUserCompletely = action({
  args: { 
    userDocId: v.id("users"), 
    clerkUserId: v.string() 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

    // 1. EXTRAER EL ID REAL DE CLERK
    // Si viene como "https://clerk...|user_123", tomamos solo "user_123"
    const actualClerkId = args.clerkUserId.includes("|") 
      ? args.clerkUserId.split("|")[1] 
      : args.clerkUserId;

    try {
      // 2. Intentamos borrar en Clerk
      await clerk.users.deleteUser(actualClerkId);
      console.log(`Usuario ${actualClerkId} eliminado de Clerk`);
    } catch (error) {
      // Si Clerk dice "Not Found", imprimimos el log pero seguimos adelante
      console.error("El usuario ya no existe en Clerk, procediendo con limpieza local...", error);
    }

    // 3. Limpieza interna en Convex (Borra Tareas y el registro en la tabla Users)
    // Usamos el ID original para filtrar las tareas en la base de datos
    await ctx.runMutation(internal.users.internalDelete, {
      userId: args.clerkUserId, 
      userDocId: args.userDocId
    });

    return { success: true };
  },
});

export const updateSubscription = internalMutation({
  args: { 
    clerkId: v.string(), 
    status: v.string() 
  },
  handler: async (ctx, { clerkId, status }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    // Actualizamos el estado a 'active'
    await ctx.db.patch(user._id, {
      subscriptionStatus: status,
    });
  },
});