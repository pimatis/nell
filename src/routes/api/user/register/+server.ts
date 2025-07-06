import type { RequestHandler } from '@sveltejs/kit';
import db from '$lib/db/connect/main';
import { Polar } from "@polar-sh/sdk";
import { rateLimit } from "$lib/server/rateLimit";

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

export const POST: RequestHandler = async (event) => {
  await rateLimit(event, {
    maxRequests: 3,
    timeWindow: 60 * 60 * 1000,
    errorMessage: "Too many registration attempts. Please try again later."
  });

  try {
    const { name, username, email, password, passwordConfirm, accountType, limit, usageCount }: RegisterUser = await event.request.json();

    if (!name || !username || !email || !password || !passwordConfirm || !accountType || limit === undefined || usageCount === undefined) {
      return new Response(
        JSON.stringify({
          error:
            'Name, username, email, password, accountType, limit, and usageCount are required.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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

    if (password !== passwordConfirm) {
      return new Response(
        JSON.stringify({
          error: "Passwords do not match.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (username.length < 3) {
      return new Response(
        JSON.stringify({
          error: "Username must be at least 3 characters long.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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

    try {
      const existingUser = await db.collection("users").getFirstListItem(`email="${email}"`).catch(() => null);
      if (existingUser) {
        return new Response(
          JSON.stringify({
            error: "User with this email already exists.",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      const existingUsername = await db.collection("users").getFirstListItem(`username="${username}"`).catch(() => null);
      if (existingUsername) {
        return new Response(
          JSON.stringify({
            error: "Username is already taken.",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      const polarCustomer = await polar.customers.create({
        externalId: email,
        email: email,
        name: name,
        billingAddress: {
          country: "US",
        },
      });

      const user = await db.collection("users").create({
        name,
        username,
        email,
        password,
        passwordConfirm,
        accountType,
        limit,
        usageCount,
        polarId: polarCustomer.id
      });

      await db.collection("users").requestVerification(email);

      return new Response(
        JSON.stringify({ 
          message: "User registered successfully. Please check your email for verification.",
          success: true 
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (polarError: any) {
      console.error('Polar or Database error:', polarError);
      
      if (polarError.message?.includes('email')) {
        return new Response(
          JSON.stringify({
            error: "Email is already registered.",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({
          error: "Failed to register user. Please try again.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

  } catch (e: any) {
    console.error('Registration error:', e);
    
    return new Response(JSON.stringify({ 
      error: "An unexpected error occurred during registration." 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
