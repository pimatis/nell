import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";

export const GET: RequestHandler = async ({ url }) => {
    try {
        const isValid = await db.authStore.isValid;

        if (!isValid) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const userId = db.authStore.model?.id;

        if (!userId) {
            return new Response(JSON.stringify({ error: "User ID not found" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const chats = await db.collection("chats").getFullList({
            filter: `user = "${userId}"`,
            sort: "-updated"
        });

        const chatList = chats.map(chat => {
            let messageCount = 0;
            let lastMessage = "";
            let messages = [];

            try {
                if (chat.chat && typeof chat.chat === 'string') {
                    messages = JSON.parse(chat.chat);
                } else if (Array.isArray(chat.chat)) {
                    messages = chat.chat;
                }

                messageCount = messages.length;

                if (messages.length > 0) {
                    const lastMsg = messages[messages.length - 1];
                    lastMessage = lastMsg?.content || "";
                }

            } catch (e) {
                console.error("Error parsing chat messages for chat:", chat.id, e);
                messageCount = 0;
                lastMessage = "Error loading messages";
            }

            return {
                id: chat.id,
                title: chat.title,
                messageCount,
                lastMessage: lastMessage.length > 50 ? lastMessage.substring(0, 50) + "..." : lastMessage,
                created: chat.created,
                updated: chat.updated
            };
        });

        return new Response(JSON.stringify({
            success: true,
            data: chatList
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error fetching chats:", error);
        return new Response(JSON.stringify({
            error: "Failed to fetch chats"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const DELETE: RequestHandler = async ({ url }) => {
    try {
        const isValid = await db.authStore.isValid;

        if (!isValid) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const userId = db.authStore.model?.id;
        const chatId = url.searchParams.get("id");

        if (!userId) {
            return new Response(JSON.stringify({ error: "User ID not found" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        if (!chatId) {
            return new Response(JSON.stringify({ error: "Chat ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        try {
            const chat = await db.collection("chats").getOne(chatId, {
                filter: `user = "${userId}"`
            });

            await db.collection("chats").delete(chatId);

            return new Response(JSON.stringify({
                success: true,
                message: "Chat deleted successfully"
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
        console.error("Error deleting chat:", error);
        return new Response(JSON.stringify({
            error: "Failed to delete chat"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

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
                    updated: chat.updated
                }
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });

        } catch (error) {
            console.error("Error fetching specific chat:", error);
            return new Response(JSON.stringify({
                error: "Chat not found or access denied"
            }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

    } catch (error) {
        console.error("Error fetching chat:", error);
        return new Response(JSON.stringify({
            error: "Failed to fetch chat"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
