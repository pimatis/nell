<script lang="ts">
    import { goto } from "$app/navigation";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { onMount } from "svelte";

    let email = "";
    let password = "";
    let loading = false;
    let error = "";
    let success = "";
    let isValid = false;

    onMount(async () => {
        const res = await fetch("/api/user/valid");
        const data = await res.json();
        isValid = data.data;

        if (isValid) {
            goto("/");
        }
    });

    async function handleLogin() {
      loading = true;
      error = "";
      success = "";

      if (!email || !password) {
          error = "Email and password are required.";
          loading = false;
          return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          error = "Please enter a valid email address.";
          loading = false;
          return;
      }

      if (password.length < 8) {
          error = "Password must be at least 8 characters long.";
          loading = false;
          return;
      }

      try {
        const res = await fetch("/api/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email.toLowerCase().trim(),
              password
            })
        });

        const data = await res.json();

        if (res.ok) {
            success = "Login successful! Redirecting...";
            localStorage.setItem("pocketbase_auth", JSON.stringify(data.data));
            setTimeout(() => {
                goto("/");
            }, 1000);
        } else {
            error = data.error || "Invalid email or password";
        }
      } catch (err) {
          console.error("Login error:", err);
          error = "An error occurred during login. Please try again.";
      } finally {
          loading = false;
      }
    }
</script>

<main class="flex justify-center min-h-screen items-center py-16 px-4">
    <div class="w-full max-w-md">
        <img src="https://www.upload.ee/image/18287819/nell-logo-white.png" alt="Logo" class="w-12 h-12 mx-auto mb-8">
        <Card.Root class="w-full">
            <Card.Header class="space-y-4">
                <Card.Title class="text-2xl font-bold text-center">Log In</Card.Title>
                <form class="space-y-4" on:submit|preventDefault={handleLogin}>
                    <div class="space-y-1">
                        <label for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                        <Input id="email" placeholder="support@nell.org" bind:value={email} required type="email" autocomplete="email" />
                    </div>

                    <div class="space-y-1">
                        <label for="password" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                        <Input id="password" placeholder="Enter your password" bind:value={password} required type="password" autocomplete="current-password" />
                    </div>

                    {#if error}
                        <div class="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    {/if}

                    {#if success}
                        <div class="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {success}
                        </div>
                    {/if}

                    <div class="pt-2">
                        <Button type="submit" class="w-full" disabled={loading || !email || !password}>
                            {loading ? "Logging in..." : "Log In"}
                        </Button>
                    </div>
                </form>

                <p class="text-center text-sm">
                    Don't have an account?{" "}
                    <a href="/signup" class="font-medium underline-offset-4 hover:underline">
                        Sign up
                    </a>
                </p>
            </Card.Header>
        </Card.Root>
    </div>
</main>
