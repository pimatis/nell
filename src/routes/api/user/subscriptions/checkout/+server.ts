import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
    accessToken: import.meta.env.VITE_APP_POLAR_KEY,
    server: "sandbox"
});

export const POST: RequestHandler = async ({ request }) => {
    try {
        const isValid = await db.authStore.isValid;

        if (!isValid) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        await db.collection("users").authRefresh();
        const user = await db.authStore.model;

        const checkout = await polar.checkouts.create({
            customerBillingAddress: {
                country: "US"
            },
            products: ["8564696a-afb7-476d-a1d5-42a3ab3ff566"],
            customerEmail: user?.email as string,
            customerName: user?.name as string,
        });

        return new Response(JSON.stringify({ 
            data: {
                checkoutId: checkout.id,
                url: checkout.url
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        console.error("Checkout creation error:", error);
        return new Response(JSON.stringify({ 
            error: "Failed to create checkout session",
            details: error.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
