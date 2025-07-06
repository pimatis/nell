import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";
import { HttpsProxyAgent } from 'https-proxy-agent';

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class ProxyManager {
    private static proxies: string[] = [];
    private static lastFetchTime = 0;
    private static readonly CACHE_DURATION = 5 * 60 * 1000;

    static async getProxies(): Promise<string[]> {
        const now = Date.now();

        if (this.proxies.length > 0 && (now - this.lastFetchTime) < this.CACHE_DURATION) {
            return this.proxies;
        }

        try {
            const randomPage = Math.floor(Math.random() * 16) + 1;
            const PROXY_API_URL = `https://proxylist.geonode.com/api/proxy-list?anonymityLevel=elite&speed=fast&limit=500&page=${randomPage}&sort_by=lastChecked&sort_type=desc`;

            const response = await fetch(PROXY_API_URL);
            if (!response.ok) {
                throw new Error(`Proxy API returned status ${response.status}`);
            }
            const data = await response.json();

            const proxyList = data.data.map((proxy: any) => `http://${proxy.ip}:${proxy.port}`);
            this.proxies = shuffleArray(proxyList);
            this.lastFetchTime = now;

            return this.proxies;
        } catch (error) {
            return this.proxies;
        }
    }

    static getRandomProxy(): string | null {
        if (this.proxies.length <= 5) {

            return this.proxies[Math.floor(Math.random() * this.proxies.length)] || null;
        }

        const slice = this.proxies.slice(5);
        return slice[Math.floor(Math.random() * slice.length)];
    }
}

async function makeAPIRequestWithRetries(url: string, options: RequestInit, maxRetries = 5): Promise<any> {
    let lastError: Error | null = null;
    await ProxyManager.getProxies();

    const triedProxies = new Set<string>();

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        let proxy: string | null = null;
        let retries = 0;

        while (!proxy || triedProxies.has(proxy)) {
            proxy = ProxyManager.getRandomProxy();
            if (!proxy || retries++ > 10) break;
        }

        if (!proxy) {
            throw new Error("No usable proxy available.");
        }

        triedProxies.add(proxy);

        try {
            const agent = new HttpsProxyAgent(proxy);

            const response = await fetch(url, {
                ...options,
                agent,
            } as any);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }


            return await response.json();

        } catch (error: any) {
            lastError = error as Error;
            if (attempt < maxRetries - 1) {
                const delay = 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }


    throw lastError || new Error('The API request failed after multiple retries.');
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { messages, model, chatId } = await request.json();
        const user = db.authStore.model;

        if (!db.authStore.isValid || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        if (user.usageCount >= user.limit) {
            return new Response(JSON.stringify({ error: "Usage limit reached" }), { status: 403 });
        }

        const data = await makeAPIRequestWithRetries(import.meta.env.VITE_APP_API_URL, {
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
        const updatedMessages = [...messages, aiResponse];
        let currentChatId = chatId;

        await db.collection("users").update(user.id, {
            "usageCount+": 1
        });

        if (chatId) {
            await db.collection("chats").update(chatId, {
                chat: JSON.stringify(updatedMessages)
            });
        } else {
            const newChat = await db.collection("chats").create({
                title: generateChatTitle(messages[0]?.content || "New Chat"),
                user: user.id,
                chat: JSON.stringify(updatedMessages)
            });
            currentChatId = newChat.id;
        }

        return new Response(JSON.stringify({
            chatId: currentChatId,
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

function generateChatTitle(firstMessage: string): string {
    const maxLength = 50;
    const trimmedMessage = firstMessage.trim();
    if (trimmedMessage.length <= maxLength) {
        return trimmedMessage;
    }
    return trimmedMessage.substring(0, maxLength - 3) + "...";
}
