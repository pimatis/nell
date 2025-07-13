import type { RequestHandler } from "@sveltejs/kit";
import { proxyAPIRequest } from "$lib/utils/proxyManager";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { messages, model } = await request.json();

        const data = await proxyAPIRequest(import.meta.env.VITE_APP_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_APP_API_KEY}`
            },
            body: JSON.stringify({ model, messages })
        });

        const aiResponse = data.choices[0]?.message;
        if (!aiResponse) {
            throw new Error("API response did not contain a message.");
        }

        return new Response(JSON.stringify({
            model: data.model,
            choices: data.choices,
            usage: data.usage
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error('Chat processing error:', error);
        const errorMessage = error?.response?.message || error?.message || 'An unexpected error occurred while processing your request.';
        const statusCode = error?.response?.status || 500;
        
        return new Response(JSON.stringify({
            error: errorMessage
        }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" }
        });
    }
};


