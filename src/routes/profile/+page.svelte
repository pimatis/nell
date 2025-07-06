<script lang="ts">
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import { goto } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import * as Dialog from "$lib/components/ui/dialog";
    import { page } from "$app/stores";
    import db from "$lib/db/connect/main";

    interface User {
        id?: string;
        name?: string;
        email?: string;
        username?: string;
        accountType?: string;
        limit?: number;
        usageCount?: number;
        verified?: boolean;
    }

    let isValid = false;
    let user: User | null = null;
    let error = "";
    let success = "";
    let cooldown = 5;
    let isLoading = false;
    let showDeleteConfirmation = false;
    let deleteConfirmationText = "";
    let subscriptions: any = null;
    let subscriptionId = "";
    let subscriptionCount = 0;
    let isUpgradeLoading = false;
    let checkoutId: string | null = null;
    let checkoutInterval: any | null = null;

    async function loadUserData() {
        try {
            const res = await fetch("/api/user/info");
            const data = await res.json();
            user = data.data;

            const subscriptionRes = await fetch("/api/user/subscriptions/get");
            if (subscriptionRes.ok) {
                const subscriptionData = await subscriptionRes.json();
                subscriptions = subscriptionData.data.result.items || [];
                subscriptionCount = subscriptions.length;
            }
        } catch (err) {
            console.error('Failed to load user data:', err);
        }
    }

    onMount(async () => {
        isLoading = true;
        try {
            const res = await fetch("/api/user/valid");
            const data = await res.json();
            isValid = data.data;

            if (!isValid) {
                goto("/login");
            } else {
                await loadUserData();
            }
        } catch (err) {
            error = "Failed to load user data. Please try again later.";
        } finally {
            isLoading = false;
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('refresh') === 'true') {
            window.history.replaceState({}, '', window.location.pathname);
            setTimeout(async () => {
                await loadUserData();
            }, 500);
        }
    });

    async function handleLogout() {
        try {
            const res = await fetch("/api/user/logout", {
                method: "POST"
            });
            if (res.ok) {
                goto("/login");
            }
        } catch (err) {
            error = "Failed to logout. Please try again.";
        }
    }

    async function handleDelete() {
        if (!showDeleteConfirmation) {
            showDeleteConfirmation = true;
            return;
        }
        
        try {
            const res = await fetch("/api/user/delete", {
                method: "POST"
            });
            if (res.ok) {
                goto("/login");
            }
        } catch (err) {
            error = "Failed to delete account. Please try again.";
            showDeleteConfirmation = false;
        }
    }

    async function handleReset() {
        try {
            await fetch("/api/user/password/reset", {
                method: "POST"
            });
            success = "Password reset email sent successfully. Check your inbox.";
            const interval = setInterval(() => {
                cooldown--;
                if (cooldown === 0) {
                    success = "";
                    clearInterval(interval);
                }
            }, 1000);
        } catch (err) {
            error = "Failed to send reset email. Please try again.";
        }
    }

    function cancelDelete() {
        showDeleteConfirmation = false;
        deleteConfirmationText = "";
        error = "";
    }

    async function handleUpgrade() {
        try {
            isUpgradeLoading = true;
            const response = await fetch('/api/user/subscriptions/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create checkout session');
            }

            const { data } = await response.json();
            checkoutId = data.checkoutId;
            
            window.open(data.url, '_blank');
            startCheckoutStatusCheck();
        } catch (err) {
            error = "Failed to start upgrade process. Please try again.";
            console.error('Upgrade error:', err);
        } finally {
            isUpgradeLoading = false;
        }
    }

    async function checkCheckoutStatus() {
        if (!checkoutId) return;

        try {
            const response = await fetch(`/api/user/subscriptions/checkout/${checkoutId}`);
            const { data, error: checkoutError } = await response.json();

            if (checkoutError) {
                throw new Error(checkoutError);
            }

            if (data.status === 'succeeded') {
                clearInterval(checkoutInterval);
                checkoutInterval = null;

                await fetch("/api/user/profile/limit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ option: "upgrade" })
                });
                
                success = "Your account has been successfully upgraded to Pro! 🎉";
                await loadUserData();
                checkoutId = null;
            }
        } catch (err) {
            console.error('Error checking checkout status:', err);
            clearInterval(checkoutInterval);
            checkoutInterval = null;
            error = "There was an issue checking your payment status. Please contact support if the problem persists.";
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

<Navbar />

<div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    {#if isLoading}
        <div class="flex flex-col min-h-screen items-center justify-center py-20">
            <img src="https://www.upload.ee/image/18294735/nell-mascot-3.png" alt="" class="w-24 h-24 mb-4">
            <h1 class="text-4xl font-bold mb-4">Please wait a moment</h1>
            <p class="text-lg opacity-80">Our developers are searching for your information in our library.</p>
            <div class="mt-6 space-x-4 sm:flex sm:flex-row md:flex md:flex-col lg:flex lg:flex-row">
                <Button class="w-full sm:w-auto md:w-full lg:w-auto" onclick={() => location.reload()}>Reload the page</Button>
                <Button class="w-full sm:w-auto md:w-full lg:w-auto mt-2 sm:mt-0 md:mt-2 lg:mt-0" onclick={() => goto("/")} variant="outline">Go back home</Button>
            </div>
        </div>
    {:else}
    <div class="max-w-3xl mx-auto">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold">Profile Settings</h1>
            <p class="mt-2 text-sm opacity-80">Manage your account settings and preferences</p>
        </div>

        {#if user}
            <Card.Root class="mb-6">
                <Card.Header>
                    <Card.Title>Account Information</Card.Title>
                    <Card.Description>View and manage your account details</Card.Description>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="fullName" class="block text-sm font-medium opacity-80 mb-1">Full Name</label>
                            <Input id="fullName" value={user.name || 'Not provided'} readonly />
                        </div>
                        <div>
                            <label for="username" class="block text-sm font-medium opacity-80 mb-1">Username</label>
                            <Input id="username" value={user.username || 'Not provided'} readonly />
                        </div>
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium opacity-80 mb-1">Email Address <i class={user.verified ? "ri-verified-badge-fill" : ""}></i></label>
                        <div class="flex items-center">
                            <Input id="email" value={user.email || 'Not provided'} readonly class="flex-1" />
                        </div>
                        {#if !user.verified}
                            <span class="text-red-500 mt-2 text-xs">We sent you a verification code but you haven't confirmed it yet. Don't let them know!</span>
                        {/if}
                    </div>
                </Card.Content>
            </Card.Root>

            {#if user.accountType === 'Premium'}
                <Card.Root class="mb-6">
                    <Card.Header>
                        <Card.Title>Subscriptions</Card.Title>
                        <Card.Description>You have {subscriptionCount} active subscription{subscriptionCount !== 1 ? 's' : ''}</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="flex items-center justify-between p-4 bg-secondary rounded-xl">
                            <div>
                                <h3 class="font-medium">Manage Your Subscriptions</h3>
                                <p class="text-sm opacity-80 pb-4">View and manage all your active subscriptions in one place</p>
                                <a href="/profile/subscriptions" class="hover:underline text-sm font-medium flex items-center opacity-50 hover:opacity-100">
                                    View All Subscriptions
                                    <i class="ri-arrow-right-line ml-1"></i>
                                </a>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
            {:else}
                <Card.Root class="mb-6">
                    <Card.Header>
                        <Card.Title>Upgrade to Pro</Card.Title>
                        <Card.Description>Unlock unlimited access to all AI models and features</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="flex items-center justify-between p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                            <div class="flex-1">
                                <h3 class="font-medium text-yellow-700">Ready to upgrade?</h3>
                                <p class="text-sm opacity-80 pb-4">Get unlimited access to all AI models for just $5/month</p>
                                <ul class="text-xs space-y-1 opacity-70 mb-4">
                                    <li>• Unlimited API usage</li>
                                    <li>• Priority support</li>
                                    <li>• All premium features</li>
                                </ul>
                                <Button onclick={handleUpgrade} class="bg-yellow-500 hover:bg-yellow-600 text-white" disabled={isUpgradeLoading}>
                                    {#if isUpgradeLoading}
                                        <i class="ri-loader-2-line animate-spin"></i>
                                        Processing...
                                    {:else if checkoutId}
                                        <i class="ri-time-line"></i>
                                        Checking payment status...
                                    {:else}
                                        Upgrade to Pro
                                    {/if}
                                </Button>
                            </div>
                            <div class="ml-4">
                                <div class="text-2xl font-bold text-yellow-600">$5</div>
                                <div class="text-xs opacity-60">/month</div>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
            {/if}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Account Type</Card.Title>
                        <Card.Description>View your account type</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label for="accountType" class="block text-sm font-medium opacity-80 mb-1">Account Type</label>
                                <Input id="accountType" value={user.accountType ? user.accountType.charAt(0).toUpperCase() + user.accountType.slice(1) : 'Free'} readonly />
                            </div>
                            {#if user.accountType === "Free"}
                                <span class="text-xs opacity-50"><i class="ri-information-fill"></i> Psst! Upgrade your account and remove API usage limits. Nell will be very happy if you do that.</span>
                            {/if}
                        </div>
                    </Card.Content>
                </Card.Root>

                <Card.Root>
                    <Card.Header>
                        <Card.Title>API Usage</Card.Title>
                        <Card.Description>Track your API usage and limits</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <label for="apiUsage" class="block text-sm font-medium opacity-80 mb-2">Monthly Usage</label>
                        <div class="relative">
                            <div class="flex items-center">
                                <div class="flex-1">
                                    <div class="w-full bg-secondary rounded-full h-2.5">
                                        <div class="bg-secondary/50 h-2.5 rounded-full" style={`width: ${Math.min(100, ((user.usageCount || 0) / (user.limit || 1)) * 100)}%`}></div>
                                    </div>
                                </div>
                                <span class="ml-2 text-sm opacity-80">{user.usageCount || 0} / {user.accountType === 'Free' ? user.limit : '∞'}</span>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>

                <Card.Root>
                    <Card.Header>
                        <Card.Title>Security</Card.Title>
                        <Card.Description>Update your password and security settings</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="space-y-2">
                            <p class="text-sm opacity-80">Change your password by requesting a reset link.</p>
                            <Button onclick={handleReset} class="w-full" variant="secondary">
                                Send Password Reset Email
                            </Button>
                        </div>
                    </Card.Content>
                </Card.Root>

                <Card.Root>
                    <Card.Header>
                        <Card.Title>Account Actions</Card.Title>
                        <Card.Description>Manage your account status</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="space-y-4">
                            <Button onclick={handleLogout} variant="secondary" class="w-full">
                                Sign out of all devices
                            </Button>
                            
                            <Dialog.Root>
                                <Dialog.Trigger class="w-full">
                                    <Button variant="destructive" class="w-full">
                                        Delete Account
                                    </Button>
                                </Dialog.Trigger>
                                <Dialog.Content>
                                    <Dialog.Header>
                                        <Dialog.Title>Delete Account</Dialog.Title>
                                        <Dialog.Description class="space-y-4">
                                            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                                            <div class="space-y-2">
                                                <label for="deleteConfirmation" class="block text-sm font-medium">
                                                    Type "Delete Account" to confirm
                                                </label>
                                                <Input id="deleteConfirmation" bind:value={deleteConfirmationText} placeholder="Type 'Delete Account'" class="w-full"/>
                                            </div>
                                        </Dialog.Description>
                                    </Dialog.Header>
                                    <Dialog.Footer>
                                        <Dialog.Close>
                                            <Button variant="outline" onclick={cancelDelete}>Cancel</Button>
                                        </Dialog.Close>
                                        <Button onclick={handleDelete} variant="destructive" disabled={deleteConfirmationText !== 'Delete Account'}>
                                            Yes, Delete My Account
                                        </Button>
                                    </Dialog.Footer>
                                </Dialog.Content>
                            </Dialog.Root>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        {/if}

        {#if error}
            <div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">{error}</p>
            </div>
        {/if}

        {#if success}
            <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-sm text-green-600">{success}</p>
            </div>
        {/if}
    </div>
    {/if}
</div>

<Footer />
