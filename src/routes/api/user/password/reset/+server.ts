import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const isValid = await db.authStore.isValid;

        if (!isValid) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        await db.collection("users").requestPasswordReset(db.authStore.model?.email);
        return new Response(JSON.stringify({ message: "Password reset email sent successfully." }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        console.error('Password reset error:', e);
        const errorMessage = e?.response?.message || e?.message || 'An unexpected error occurred while requesting password reset.';
        const statusCode = e?.response?.status || 500;
        
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" }
        });
    }
}