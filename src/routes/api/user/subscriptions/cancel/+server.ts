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
        const { subscriptionId } = await request.json();

        if (!isValid) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        await db.collection("users").authRefresh();
        const user = await db.authStore.model;

        await polar.subscriptions.revoke({
            id: subscriptionId
        });

        return new Response(JSON.stringify({ data: user }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ 
            error: "Internal server error",
            details: error.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};