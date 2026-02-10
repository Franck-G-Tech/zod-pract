import { v } from "convex/values";
import { mutation, query } from "./_generated/server"

export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.tokenIdentifier.split("|")[1];
        return await ctx.db
        .query("task")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();
    }
});

export const create = mutation({
    args: { title: v.string(),
        taskLimit: v.number(),
     },
    handler: async (ctx, { title, taskLimit }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const userId = identity.tokenIdentifier.split("|")[1];

        // 1. Obtener la información del usuario para verificar su plan
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
            .unique();

        // 2. Contar tareas actuales del usuario
        const userTasks = await ctx.db
            .query("task")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();

        // 3. Regla de Negocio: Límite de 5 para usuarios gratuitos
        const isPro = user?.subscriptionStatus === "active";
        if (!isPro && userTasks.length >= taskLimit) {
            // El backend bloquea la acción
            throw new Error("LIMIT_REACHED");
        }

        const id = await ctx.db.insert("task", {
            title,
            completed: false,
            userId: userId,
        });
        return id;
    }
});

export const update = mutation({
    args: { id: v.id("task"),
         completed: v.boolean() },
    handler: async (ctx, { id, completed }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const task = await ctx.db.get(id);
        const userId = identity.tokenIdentifier.split("|")[1];
        if (task && task.userId !== userId) {
            throw new Error("Unauthorized");
        }
        await ctx.db.patch(id, { completed });
    }
});

export const deleteTask = mutation({
    args: { id: v.id("task") },
    handler: async (ctx, { id }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.tokenIdentifier.split("|")[1];
        const task = await ctx.db.get(id);
        if (task && task.userId !== userId) {
            throw new Error("Unauthorized");
        }
        await ctx.db.delete(id);
    }
}); 

