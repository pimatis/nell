<script lang="ts">
    import { goto } from "$app/navigation";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { onMount } from "svelte";

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

        const res = await fetch("/api/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                username,
                email,
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
            success = "Registration successful! Redirecting to login page...";
            goto("/login");
        } else {
            error = data.error || "An error occurred.";
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
                        <Button type="submit" class="w-full" disabled={loading || !name || !username || !email || !password || !passwordConfirm || password !== passwordConfirm}>
                            {loading ? "Signing up..." : "Sign Up"}
                        </Button>
                    </div>
                </form>

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
