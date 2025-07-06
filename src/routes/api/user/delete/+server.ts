import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const isValid = await db.authStore.isValid;

        if (!isValid) {
            return new Response(JSON.stringify({ error: "User is not authenticated." }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const res = await db.collection("users").delete(`${db.authStore.model?.id}`);

        return new Response(
            JSON.stringify({
                message: "User deleted successfully.",
                data: res,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.response.message }), {
            status: e.response.status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
