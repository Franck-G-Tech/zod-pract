import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

// Inicializamos Stripe fuera del handler para reutilizar la instancia
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

// 1. Acción para crear la sesión de pago (Llamada desde el Frontend)
export const pay = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Debes iniciar sesión para suscribirte.");
    }

    const userId = identity.tokenIdentifier.split("|")[1];
    const domain = process.env.NEXT_PUBLIC_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        clerkId: userId,
      },
      success_url: `${domain}/dashboard?payment=success`,
      cancel_url: `${domain}/dashboard?payment=cancel`,
    });

    return session.url;
  },
});

// 2. Acción interna para procesar el Webhook (Llamada desde http.ts)
export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, { signature, payload }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    console.log("🔔 Webhook recibido. Verificando firma...");

    try {
      const event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        webhookSecret
      );
      
      console.log(`✅ Firma verificada. Tipo de evento: ${event.type}`);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkId = session.metadata?.clerkId;
        
        console.log(`💳 Sesión completada. ClerkId en metadata: ${clerkId}`);

        if (clerkId) {
          await ctx.runMutation(internal.users.updateSubscription, {
            clerkId,
            status: "active",
          });
          console.log(`🚀 Suscripción activada exitosamente para: ${clerkId}`);
        } else {
          console.warn("⚠️ No se encontró clerkId en los metadatos de la sesión.");
        }
      } else {
        console.log(`ℹ️ Evento ignorado: ${event.type}`);
      }

      return { success: true };
    } catch (err) {
      console.error("❌ Error CRÍTICO en Webhook:", err);
      return { success: false };
    }
  },
});