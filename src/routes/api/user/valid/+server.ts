import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";

export const GET: RequestHandler = async ({ request }) => {
    try {
        const res = await db.authStore.isValid;
        return new Response(JSON.stringify({ data: res }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.response.message }), {
            status: e.response.status,
            headers: { "Content-Type": "application/json" }
        });
    }
};