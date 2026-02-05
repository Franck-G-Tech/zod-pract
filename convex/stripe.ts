import { action } from "./_generated/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export const pay = action({
    args:{},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Debes iniciar sesión para suscribirte.");
        }

        const userId = identity.tokenIdentifier.split("|")[1];
        const domain = process.env.NEXT_PUBLIC_URL;
        
        const session = await stripe.checkout.sessions.create({
            mode:"payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            metadata: {
                clerkId: userId
            },
            success_url:`${domain}/dashboard?payment=success`,
            cancel_url:`${domain}/dashboard?payment=cancel`,
        });

        return session.url;
    }
});