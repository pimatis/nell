import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";

export const GET: RequestHandler = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ error: "Chat ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        try {
            const chat = await db.collection("chats").getOne(id);

            if (!chat.isPublic) {
                return new Response(JSON.stringify({
                    error: "Chat not found or not public"
                }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                });
            }

            let messages = [];
            try {
                if (chat.chat && typeof chat.chat === 'string') {
                    messages = JSON.parse(chat.chat);
                } else if (Array.isArray(chat.chat)) {
                    messages = chat.chat;
                } else {
                    console.log("Chat data is neither string nor array:", typeof chat.chat);
                }
            } catch (e) {
                console.error("Error parsing chat messages:", e);
                messages = [];
            }

            return new Response(JSON.stringify({
                success: true,
                data: {
                    id: chat.id,
                    title: chat.title,
                    messages: messages,
                    created: chat.created,
                    updated: chat.updated,
                    isPublic: chat.isPublic
                }
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });

        } catch (error) {
            return new Response(JSON.stringify({
                error: "Chat not found or not public"
            }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

    } catch (error) {
        console.error("Error fetching public chat:", error);
        return new Response(JSON.stringify({
            error: "Failed to fetch chat"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
