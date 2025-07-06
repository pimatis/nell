<script lang="ts">
    import { goto } from "$app/navigation";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { onMount } from "svelte";
    import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";

    let name = "";
    let username = "";
    let email = "";
    let password = "";
    let passwordConfirm = "";
    let accountType = "Free";
    let limit = 0;
    let usageCount = 0;
    let loading = false;
    let error = "";
    let success = "";
    let isValid = false;
    let termsAccepted = false;

    onMount(async () => {
        const res = await fetch("/api/user/valid");
        const data = await res.json();
        isValid = data.data;

        if (isValid) {
            goto("/");
        }
    });

    async function handleRegister() {
        loading = true;
        error = "";
        success = "";

        if (!name || !username || !email || !password || !passwordConfirm) {
            error = "All fields are required.";
            loading = false;
            return;
        }

        if (!termsAccepted) {
            error = "You must accept the terms and conditions.";
            loading = false;
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            error = "Please enter a valid email address.";
            loading = false;
            return;
        }

        if (username.length < 3) {
            error = "Username must be at least 3 characters long.";
            loading = false;
            return;
        }

        if (password.length < 8) {
            error = "Password must be at least 8 characters long.";
            loading = false;
            return;
        }

        if (password !== passwordConfirm) {
            error = "Passwords do not match.";
            loading = false;
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            error = "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
            loading = false;
            return;
        }

        try {
            const res = await fetch("/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    username: username.toLowerCase().trim(),
                    email: email.toLowerCase().trim(),
                    password,
                    passwordConfirm,
                    accountType,
                    limit,
                    usageCount
                })
            });

            const data = await res.json();
            loading = false;

            if (res.ok) {
                success = "Registration successful! Please check your email for verification. Redirecting to login page...";
                setTimeout(() => {
                    goto("/login");
                }, 2000);
            } else {
                error = data.error || "An error occurred during registration.";
            }
        } catch (err) {
            console.error("Registration error:", err);
            error = "An error occurred during registration. Please try again.";
            loading = false;
        }
    }
</script>

<main class="flex justify-center min-h-screen items-center py-16 px-4">
    <div class="w-full max-w-md">
        <img src="https://www.upload.ee/image/18287819/nell-logo-white.png" alt="Logo" class="w-12 h-12 mx-auto mb-8">
        <Card.Root class="w-full">
            <Card.Header class="space-y-4">
                <Card.Title class="text-2xl font-bold text-center">Sign Up</Card.Title>
                <form class="space-y-4" on:submit|preventDefault={handleRegister}>
                    <div class="space-y-1">
                        <label for="name" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                        <Input id="name" bind:value={name} placeholder="Nell AI" required autocomplete="name" />
                    </div>

                    <div class="space-y-1">
                        <label for="username" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Username</label>
                        <Input id="username" placeholder="nell" bind:value={username} required autocomplete="username" />
                    </div>

                    <div class="space-y-1">
                        <label for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                        <Input id="email" placeholder="support@nell.org" bind:value={email} required type="email" autocomplete="email" />
                    </div>

                    <div class="space-y-1">
                        <label for="password" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                        <Input id="password" placeholder="123456 (don't use such a password)" bind:value={password} required type="password" autocomplete="new-password" />
                    </div>

                    <div class="space-y-1">
                        <label for="passwordConfirm" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Confirm Password</label>
                        <Input id="passwordConfirm" placeholder="123456 (don't use such a password)" bind:value={passwordConfirm} required type="password" autocomplete="new-password" />
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
                        <Button type="submit" class="w-full" disabled={loading || !name || !username || !email || !password || !passwordConfirm || password !== passwordConfirm || password.length < 8 || !termsAccepted}>
                            {loading ? "Signing up..." : "Sign Up"}
                        </Button>
                    </div>
                </form>

                <div class="space-y-1">
                    <label for="terms" class="flex items-center justify-center">
                        <Checkbox id="terms" bind:checked={termsAccepted} required class="mr-2" />
                        <span class="text-sm">I agree to the <a href="/terms" class="font-medium underline">Terms of Service</a> and <a href="/privacy" class="font-medium underline">Privacy Policy</a>.</span>
                    </label>
                </div>

                <p class="text-center text-sm">
                    Already have an account?{" "}
                    <a href="/login" class="font-medium underline-offset-4 hover:underline">
                        Log in
                    </a>
                </p>
            </Card.Header>
        </Card.Root>
    </div>
</main>
