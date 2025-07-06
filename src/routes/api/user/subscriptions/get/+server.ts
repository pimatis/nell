import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
    accessToken: import.meta.env.VITE_APP_POLAR_KEY,
    server: "sandbox"
});

export const GET: RequestHandler = async ({ request }) => {
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

        if (!user?.polarId) {
            return new Response(JSON.stringify({ 
                error: "Polar ID not found.",
                data: { ...user, listSubscriptions: [] }
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        try {
            const listSubscriptions = await polar.subscriptions.list({
                customerId: user.polarId
            });
            
            return new Response(JSON.stringify({ 
                data: listSubscriptions
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error: any) {
            return new Response(JSON.stringify({ 
                error: "Failed to fetch Polar subscriptions",
                details: error.message,
                data: { ...user, listSubscriptions: [] }
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
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