<script lang="ts">
    import Navbar from "../../../components/Navbar.svelte";
    import Footer from "../../../components/Footer.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { page } from "$app/stores";
    import * as Dialog from "$lib/components/ui/dialog";

    let isLoading = true;
    let subscriptions: any = null;
    let error = "";

    onMount(async () => {
        try {
            const res = await fetch("/api/user/subscriptions/get");
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Failed to load subscriptions');
            }
            
            subscriptions = data.data.result.items;
        } catch (err: any) {
            error = err.message || "Failed to load subscriptions. Please try again later.";
            console.error('Subscription load error:', err);
        } finally {
            isLoading = false;
        }
    });

    async function handleCancelSubscription(subscriptionId: string) {
        try {
            const response = await fetch("/api/user/subscriptions/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId })
            });

            await fetch("/api/user/profile/limit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ option: "downgrade" })
            });
            
            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            window.location.reload();
        } catch (err) {
            error = "Failed to cancel subscription. Please try again.";
            console.error('Subscription cancellation error:', err);
        }
    }
</script>

<Navbar />

<div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
        <div class="flex items-center mb-6">
            <Button onclick={() => window.history.back()} variant="ghost" class="mr-4" size="sm" aria-label="Go back">
                <i class="ri-arrow-left-line text-xl"></i>
            </Button>
            <h1 class="text-2xl font-bold">My Subscriptions</h1>
        </div>

        {#if isLoading}
            <div class="flex flex-col min-h-screen items-center justify-center py-20">
                <img src="https://www.upload.ee/image/18294735/nell-mascot-3.png" alt="" class="w-24 h-24 mb-4">
                <h1 class="text-4xl font-bold mb-4">Please wait a moment</h1>
                <p class="text-lg opacity-80">Our developers are searching for your subscriptions in our library.</p>
                <div class="mt-6 space-x-4 sm:flex sm:flex-row md:flex md:flex-col lg:flex lg:flex-row">
                    <Button class="w-full sm:w-auto md:w-full lg:w-auto" onclick={() => location.reload()}>Reload the page</Button>
                    <Button class="w-full sm:w-auto md:w-full lg:w-auto mt-2 sm:mt-0 md:mt-2 lg:mt-0" onclick={() => goto("/")} variant="outline">Go back home</Button>
                </div>
            </div>
        {:else if error}
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="ri-error-warning-line text-red-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        {:else if !subscriptions?.length}
            <div class="text-center py-12">
                <i class="ri-subtract-line text-4xl opacity-50 mb-4"></i>
                <p class="opacity-50">No subscriptions found.</p>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each subscriptions as subscription}
                    <Card.Root>
                        <Card.Header>
                            <Card.Title class="flex items-center justify-between">
                                <span>Subscription</span>
                                {#if subscription.status === 'active'}
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 border border-green-500 text-green-500">
                                        Active
                                    </span>
                                {:else if subscription.status === 'canceled'}
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 border border-red-500 text-red-500">
                                        Canceled
                                    </span>
                                {:else}
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 border border-gray-500 text-gray-500">
                                        {subscription.status}
                                    </span>
                                {/if}
                            </Card.Title>
                            <Card.Description>Subscription details</Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-sm opacity-80">Plan:</span>
                                <span class="text-sm font-medium">{subscription.product?.name || 'N/A'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm opacity-80">Amount:</span>
                                <span class="text-sm font-medium">
                                    ${(subscription?.amount / 100).toFixed(2)}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm opacity-80">Created:</span>
                                <span class="text-sm">
                                    {new Date(subscription.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            {#if subscription?.currentPeriodEnd}
                                <div class="flex justify-between">
                                    <span class="text-sm opacity-80">
                                        {subscription.status === 'canceled' ? 'Ends at' : 'Renews on'}:
                                    </span>
                                    <span class="text-sm">
                                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                    </span>
                                </div>
                            {/if}
                        </Card.Content>
                        {#if subscription.status === 'active'}
                            <Card.Footer class="flex justify-end space-x-2">
                                <Dialog.Root>
                                    <Dialog.Trigger class="w-full">
                                        <Button variant="destructive" class="w-full">
                                            Cancel Subscription
                                        </Button>
                                    </Dialog.Trigger>
                                    <Dialog.Content>
                                        <Dialog.Header>
                                            <Dialog.Title>Cancel Subscription</Dialog.Title>
                                            <Dialog.Description>
                                                Are you sure you want to cancel this subscription?
                                            </Dialog.Description>
                                        </Dialog.Header>
                                        <Dialog.Footer>
                                            <Dialog.Close>
                                                <Button variant="outline">Cancel</Button>
                                            </Dialog.Close>
                                            <Dialog.Close>
                                                <Button onclick={() => handleCancelSubscription(subscription.id)} variant="destructive">Yes, Cancel Subscription</Button>
                                            </Dialog.Close>
                                        </Dialog.Footer>
                                    </Dialog.Content>
                                </Dialog.Root>
                            </Card.Footer>
                        {/if}
                    </Card.Root>
                {/each}
            </div>
        {/if}
    </div>
</div>

<Footer />
