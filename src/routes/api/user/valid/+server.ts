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
        console.error('Validation error:', e);
        const errorMessage = e?.response?.message || e?.message || 'An unexpected error occurred during validation.';
        const statusCode = e?.response?.status || 500;
        
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" }
        });
    }
};