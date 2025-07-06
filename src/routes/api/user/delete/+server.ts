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
            return new Response(JSON.stringify({ error: "User is not authenticated." }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        polar.customers.delete({
            id: db.authStore.model?.polarId
        }).catch((error) => {
            console.error('Polar customer deletion error:', error);
            return new Response(JSON.stringify({ error: "Failed to delete Polar customer." }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        });
        const res = await db.collection("users").delete(`${db.authStore.model?.id}`);

        return new Response(
            JSON.stringify({
                message: "User deleted successfully.",
                data: res,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (e: any) {
        console.error('User delete error:', e);
        const errorMessage = e?.response?.message || e?.message || 'An unexpected error occurred while deleting user.';
        const statusCode = e?.response?.status || 500;
        
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }
};
