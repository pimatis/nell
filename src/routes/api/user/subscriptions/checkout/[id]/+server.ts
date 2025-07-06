import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
    accessToken: import.meta.env.VITE_APP_POLAR_KEY,
    server: "sandbox"
});

export const GET: RequestHandler = async ({ params }) => {
    try {
        const { id } = params;

        const checkout = await polar.checkouts.get({
            id: id as string
        });

        return new Response(JSON.stringify({ 
            data: {
                status: checkout.status,
                subscriptionId: checkout.subscriptionId
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        console.error("Checkout status error:", error);
        return new Response(JSON.stringify({ 
            error: "Failed to get checkout status",
            details: error.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
