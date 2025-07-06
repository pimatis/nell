import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";
import { rateLimit } from "$lib/server/rateLimit";

interface LoginUser {
  email: string;
  password: string;
}

export const POST: RequestHandler = async (event) => {
  await rateLimit(event, {
    maxRequests: 5,
    timeWindow: 15 * 60 * 1000,
    errorMessage: "Too many login attempts. Please try again later."
  });

  try {
    const { email, password }: LoginUser = await event.request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: "Email and password are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          error: "Invalid email format.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({
          error: "Password must be at least 8 characters long.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const res = await db.collection("users").authWithPassword(email, password);
      
      return new Response(
        JSON.stringify({
          message: "User logged in successfully.",
          data: {
            id: res.record.id,
            email: res.record.email,
            name: res.record.name,
            username: res.record.username,
            accountType: res.record.accountType,
            token: res.token
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (authError: any) {
      console.error('Authentication failed:', authError);
      
      return new Response(
        JSON.stringify({
          error: "Invalid email or password.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (e: any) {
    console.error('Login error:', e);
    
    return new Response(JSON.stringify({ 
      error: "An unexpected error occurred during login." 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
