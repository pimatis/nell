import type { RequestHandler } from "@sveltejs/kit";
import { Resend } from "resend";
import { error } from '@sveltejs/kit';
import { rateLimit } from '$lib/server/rateLimit';

const resend = new Resend(import.meta.env.VITE_APP_RESEND_KEY);

interface ContactForm {
    name: string;
    email: string;
    message: string;
}

export const POST: RequestHandler = async (event) => {
    const { request } = event;
    
    try {
        await rateLimit(event, {
            maxRequests: 5,
            timeWindow: 15 * 60 * 1000,
            errorMessage: 'Too many contact form submissions. Please try again later.'
        });
    } catch (e: unknown) {
        if (e && typeof e === 'object' && 'status' in e && e.status === 429) {
            const error = e as { status: number; body: { message: string; retryAfter: number } };
            return new Response(
                JSON.stringify({
                    error: error.body.message,
                    retryAfter: error.body.retryAfter
                }),
                { 
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': error.body.retryAfter.toString()
                    }
                }
            );
        }
        throw e;
    }
    try {
        const { name, email, message }: ContactForm = await request.json();

        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({
                    error: "Name, email, and message are required.",
                }),
                { status: 400 }
            );
        }

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "fatihbugrayilmz@gmail.com",
            subject: `${name} sent you a message`,
            html: `<p>${message}</p>`,
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Email sent successfully.",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({
                error: "Failed to send email.",
            }),
            { status: 500 }
        );
    }
};