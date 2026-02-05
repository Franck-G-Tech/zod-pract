import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  task: defineTable({
    title: v.string(),
    userId: v.string(),
    completed: v.boolean(),
  }).index("by_userId", ["userId"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(), // ID único que viene de Clerk
    isAdmin: v.boolean(),
    stripeCustomerId: v.optional(v.string()),
    endsOn: v.optional(v.number()), // Para control de tiempo si fuera necesario
    subscriptionStatus: v.optional(v.string()), // 'active', 'trialing', etc.
  }).index("by_clerkId", ["clerkId"]),
});
    