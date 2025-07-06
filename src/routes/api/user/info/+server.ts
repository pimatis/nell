import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";

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