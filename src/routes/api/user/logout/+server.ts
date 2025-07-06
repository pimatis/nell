import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";

export const POST: RequestHandler = async ({ request }) => {
    try {
        await db.authStore.clear();
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        console.error('Logout error:', e);
        const errorMessage = e?.response?.message || e?.message || 'An unexpected error occurred during logout.';
        const statusCode = e?.response?.status || 500;
        
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" }
        });
    }
};