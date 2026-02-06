import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http= httpRouter();

http.route({
path: "/stripe-webhook",
method: "POST",
handler: httpAction(async (ctx, req) => {
    const signature = req.headers.get("Stripe-Signature") 

    if (!signature) {
        return new Response("Sin firma de stripe", { status: 400 });
    }

    const payload = await req.text();

    const result = await ctx.runAction(internal.stripe.fulfill,{
        signature,
        payload
    });
    if (result.success) {
        return new Response("Éxito", { status: 200 });
    } else {
        return new Response("Error en la validación", { status: 400 });
    }
})
});

export default http;