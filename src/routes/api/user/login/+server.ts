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

    const res = await db.collection("users").authWithPassword(email, password);

    return new Response(
      JSON.stringify({
        message: "User logged in successfully.",
        data: res,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.response.message }), {
      status: e.response.status,
      headers: { "Content-Type": "application/json" },
    });
  }
};
