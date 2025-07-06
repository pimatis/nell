import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { chatId } = await request.json();
        const isValid = await db.authStore.isValid;

        if (!isValid) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const userId = db.authStore.model?.id;

        if (!userId || !chatId) {
            return new Response(JSON.stringify({ error: "User ID or Chat ID not found" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        try {
            const chat = await db.collection("chats").getOne(chatId, {
                filter: `user = "${userId}"`
            });

            await db.collection("chats").update(chatId, {
                isPublic: true
            });

            return new Response(JSON.stringify({
                success: true,
                message: "Chat shared successfully",
                shareUrl: `/chat/${chatId}`
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });

        } catch (error) {
            return new Response(JSON.stringify({
                error: "Chat not found or access denied"
            }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

    } catch (error) {
        console.error("Error sharing chat:", error);
        return new Response(JSON.stringify({
            error: "Failed to share chat"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};