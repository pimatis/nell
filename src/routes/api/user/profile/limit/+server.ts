import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";

export const POST: RequestHandler = async ({ request }) => {
    const data: { option: string } = await request.json();

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

        if (data.option === "upgrade") {
            await db.collection("users").update(`${user?.id}`, {
                accountType: "Premium",
                limit: 9999999,
            });
        } else if (data.option === "downgrade") {
            await db.collection("users").update(`${user?.id}`, {
                accountType: "Free",
                limit: 0,
            });
        } else {
            return new Response(JSON.stringify({ error: "Invalid option" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        await db.collection("users").authRefresh();

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