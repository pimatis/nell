import { HttpsProxyAgent } from 'https-proxy-agent';

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class Proxy {
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

export async function proxyAPIRequest(url: string, options: RequestInit, maxRetries = 5): Promise<any> {
    let lastError: Error | null = null;
    await Proxy.getProxies();

    const triedProxies = new Set<string>();

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        let proxy: string | null = null;
        let retries = 0;

        while (!proxy || triedProxies.has(proxy)) {
            proxy = Proxy.getRandomProxy();
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