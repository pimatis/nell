import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimits.entries()) {
        if (value.resetAt < now) {
            rateLimits.delete(key);
        }
    }
}, 10 * 60 * 1000);

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        clearInterval(cleanupInterval);
    });
}

export async function rateLimit(
    event: RequestEvent,
    options: { 
        maxRequests: number; 
        timeWindow: number;
        errorMessage?: string;
    } = { 
        maxRequests: 5, 
        timeWindow: 15 * 60 * 1000,
        errorMessage: 'Too many requests. Please try again later.'
    }
) {
    const ip = event.getClientAddress();
    const now = Date.now();
    const windowStart = now - options.timeWindow;
    const rateLimit = rateLimits.get(ip) || { count: 0, resetAt: now + options.timeWindow };

    if (rateLimit.resetAt < now) {
        rateLimit.count = 0;
        rateLimit.resetAt = now + options.timeWindow;
    }

    rateLimit.count++;
    rateLimits.set(ip, rateLimit);

    event.setHeaders({
        'X-RateLimit-Limit': options.maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, options.maxRequests - rateLimit.count).toString(),
        'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
    });

    if (rateLimit.count > options.maxRequests) {
        const retryAfter = Math.ceil((rateLimit.resetAt - now) / 1000);
        throw error(429, {
            message: options.errorMessage || 'Too many requests',
        });
    }
}
