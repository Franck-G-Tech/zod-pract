import { NextResponse } from "next/server";
import Stripe from "stripe";
import { internal } from "../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { FunctionReference } from "convex/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Error verifying Stripe webhook signature:", err);
    return new NextResponse("Webhook Error " + err, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkId = session.metadata?.clerkId;

    if (!clerkId) {
      console.error("❌ Error: No se encontró clerkId en los metadatos de la sesión.");
      return new NextResponse("Metadata missing", { status: 400 });
    }

    if (clerkId) {
     try {
        // Casting para la referencia de la función interna
        const internalMutationRef = (internal.users.updateSubscription as unknown) as FunctionReference<"mutation">;

        // Ejecución de la mutación
        await convex.mutation(internalMutationRef, {
          clerkId: clerkId,
          status: "active",
        });
        
        console.log(`✅ Suscripción activada exitosamente para ${clerkId}`);
      } catch (mutationError) {
        console.error("❌ Error al actualizar en Convex:", mutationError);
        // Devolvemos 500 para que Stripe sepa que debe reintentar más tarde
        return new NextResponse("Error interno al actualizar suscripción", { status: 500 });
      }
    }
}
  return new NextResponse("Success", { status: 200 });
}
