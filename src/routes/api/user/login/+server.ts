import type { RequestHandler } from "@sveltejs/kit";
import db from "$lib/db/connect/main";

interface LoginUser {
  email: string;
  password: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password }: LoginUser = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: "Email and password are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const res = await db.collection("users").authWithPassword(email, password).catch((error) => {
      console.error('Login error:', error);
      return new Response(JSON.stringify({ error: "Failed to login user." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    });

    return new Response(
      JSON.stringify({
        message: "User logged in successfully.",
        data: res,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error('Login error:', e);
    const errorMessage = e?.response?.message || e?.message || 'An unexpected error occurred during login.';
    const statusCode = e?.response?.status || 500;
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }
};
