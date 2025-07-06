import type { RequestHandler } from '@sveltejs/kit';
import db from '$lib/db/connect/main';
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: import.meta.env.VITE_APP_POLAR_KEY,
  server: "sandbox"
});

const emailProviders = [
  '@gmail.com',
  '@icloud.com',
  '@outlook.com',
  '@yahoo.com',
  '@protonmail.com',
  '@hotmail.com',
  '@aol.com',
  '@mail.com',
  '@zoho.com',
  '@yandex.com'
];

interface RegisterUser {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  accountType: string;
  limit: number;
  usageCount: number;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, username, email, password, passwordConfirm, accountType, limit, usageCount }: RegisterUser = await request.json();

    if (!name || !username || !email || !password || !passwordConfirm || !accountType || limit === undefined || usageCount === undefined) {
      return new Response(
        JSON.stringify({
          error:
            'Name, username, email, password, accountType, limit, and usageCount are required.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!emailProviders.some((provider) => email.endsWith(provider))) {
      return new Response(
        JSON.stringify({
          error: "Invalid email provider.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    polar.customers.create({
      externalId: email,
      email: email,
      name: name,
      billingAddress: {
        country: "US",
      },
    }).then(async (res) => {
      await db.collection("users").create({
        name,
        username,
        email,
        password,
        passwordConfirm,
        accountType,
        limit,
        usageCount,
        polarId: res.id
      }).then(async () => {
        db.collection("users").requestVerification(email);
      });
    }).catch((error) => {
      console.error('Registration error:', error);
      return new Response(JSON.stringify({ error: "Failed to register user." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    console.error('Registration error:', e);
    const errorMessage = e?.response?.message || e?.message || 'An unexpected error occurred during registration.';
    const statusCode = e?.response?.status || 500;
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
