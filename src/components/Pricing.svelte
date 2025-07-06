<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";

    const proFeatures = [
        "Unlimited access to all AI models",
        "No usage limits or hidden fees",
        "Priority API access",
        "24/7 Priority support",
        "Regular model updates",
        "Advanced analytics"
    ];

    let isLoading: boolean = false;
    let checkoutId: string | null = null;
    let checkoutInterval: any | null = null;
    let isValid = false;

    onMount(async () => {
        const res = await fetch("/api/user/valid");
        const data = await res.json();
        isValid = data.data;
    });

    async function handleUpgrade() {
        try {
            isLoading = true;
            const response = await fetch('/api/user/subscriptions/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create checkout session');
            }

            const { data } = await response.json();
            checkoutId = data.checkoutId;
            
            window.open(data.url, '_blank');
            startCheckoutStatusCheck();
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            isLoading = false;
        }
    }

    async function checkCheckoutStatus() {
        if (!checkoutId) return;

        try {
            const response = await fetch(`/api/user/subscriptions/checkout/${checkoutId}`);
            const { data, error } = await response.json();

            if (error) {
                throw new Error(error);
            }

            if (data.status === 'succeeded') {
                clearInterval(checkoutInterval);
                checkoutInterval = null;

                await fetch("/api/user/profile/limit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ option: "upgrade" })
                });
                
                window.location.href = '/profile';
            }
        } catch (error) {
            console.error('Error checking checkout status:', error);
            clearInterval(checkoutInterval);
            checkoutInterval = null;
        }
    }

    function startCheckoutStatusCheck() {
        if (checkoutInterval) {
            clearInterval(checkoutInterval);
        }
        
        checkoutInterval = setInterval(checkCheckoutStatus, 10000);
    }

    onDestroy(() => {
        if (checkoutInterval) {
            clearInterval(checkoutInterval);
        }
    });
</script>

<div class="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 md:px-8">
    <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-foreground mb-3">Simple, Transparent Pricing</h2>
        <p class="text-sm opacity-80 max-w-2xl mx-auto">One plan to rule them all. Unlimited access to all AI models for one low price.</p>
    </div>

    <div class="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
        <!-- Pro Plan -->
        <Card.Root class="relative overflow-hidden border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-lg flex flex-col h-full">
            <div class="absolute top-0 right-0 bg-yellow-500/50 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <div>
                <Card.Header class="pb-4">
                    <Card.Title class="text-xl font-semibold">Pro</Card.Title>
                    <Card.Description>For power users and businesses</Card.Description>
                    <div class="mt-4">
                        <span class="text-4xl font-bold">$5</span>
                        <span class="text-sm opacity-80">/month</span>
                    </div>
                </Card.Header>
                <Card.Content class="space-y-3">
                    <ul class="space-y-2">
                        {#each proFeatures as feature}
                            <li class="flex items-center">
                                <i class="ri-check-line text-yellow-500 mr-2"></i>
                                <span class="text-sm">{feature}</span>
                            </li>
                        {/each}
                    </ul>
                </Card.Content>
            </div>
            <div class="mt-auto p-6 pt-0">
                <Button onclick={handleUpgrade} class="w-full bg-yellow-500" disabled={isLoading || !isValid}>
                    {#if isLoading}
                        <i class="ri-loader-2-line animate-spin"></i>
                    {/if}
                    {#if !isValid}
                        <i class="ri-error-warning-line"></i>
                        You are not logged in. Please log in to upgrade.
                    {:else}
                        {isLoading ? 'Processing...' : 'Upgrade to Pro'}
                    {/if}
                </Button>
            </div>
        </Card.Root>
    </div>

    <div class="mt-12 text-center text-sm text-foreground/70">
        <p>Need a custom solution for your enterprise? <a href="/contact" class="text-primary hover:underline">Contact us</a></p>
    </div>
</div>
