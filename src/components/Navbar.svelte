<script>
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import Vault from "./Vault.svelte";
    import { onMount } from "svelte";

    let dropdownOpen = false;
    let mobileMenuOpen = false;
    let isValid = false;

    let navbarItems = [
        {
            title: "Home",
            href: "/"
        },
        {
            title: "Copilot",
            href: "/",
            disabled: true,
            dropdown: true
        }
    ];

    onMount(async () => {
        const res = await fetch("/api/user/valid");
        const data = await res.json();
        isValid = data.data;
    });

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }
</script>

<nav class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
    <div class="relative">
        <!-- Desktop and Tablet Navigation -->
        <div class="hidden md:block">
            <div class="w-full bg-primary lg:w-[40rem] h-14 backdrop-blur-xl flex flex-col justify-center mx-auto rounded-full px-6 lg:px-10 text-sm">
                <div class="flex items-center justify-between">
                    <a href="/"><img src="https://www.upload.ee/image/18287819/nell-logo-white.png" alt="nell-logo" class="w-8"></a>
                    <ul class="flex space-x-2 lg:space-x-4">
                        {#each navbarItems as item (item.title)}
                            {#if !item.dropdown}
                                <li>
                                    <a href={item.href} class="opacity-80 hover:opacity-100 transition-all duration-300 text-xs lg:text-sm">{item.title}</a>
                                </li>
                            {/if}
                        {/each}
                        {#if navbarItems.some(item => item.dropdown)}
                            <li>
                                <DropdownMenu.Root onOpenChange={(open) => dropdownOpen = open}>
                                    <DropdownMenu.Trigger>
                                        <span class="opacity-80 hover:opacity-100 transition-all duration-300 hover:cursor-pointer flex items-center gap-1 text-xs lg:text-sm">
                                            Links
                                            <i class={dropdownOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                                        </span>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content>
                                        {#each navbarItems.filter(item => item.dropdown) as item (item.title)}
                                            <DropdownMenu.Item disabled={item.disabled}>
                                                <a href={item.href} class="opacity-80 hover:opacity-100 transition-all duration-300 {item.disabled ? 'cursor-not-allowed opacity-50' : ''}">
                                                    {item.title}
                                                </a>
                                                {#if item.disabled}
                                                    <Badge variant="destructive">Soon</Badge>
                                                {/if}
                                            </DropdownMenu.Item>
                                        {/each}
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </li>
                        {/if}
                        {#if isValid}
                            <li>
                                <a href="/profile" class="opacity-80 hover:opacity-100 transition-all duration-300 text-xs lg:text-sm">Profile</a>
                            </li>
                        {/if}
                    </ul>
                </div>
            </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="md:hidden">
            <div class="h-14 bg-primary backdrop-blur-xl flex items-center justify-between rounded-full px-6 text-sm">
                <img src="https://www.upload.ee/image/18287819/nell-logo-white.png" alt="nell-logo" class="w-6">
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button on:click={toggleMobileMenu} class="text-white opacity-80 hover:opacity-100 transition-all duration-300">
                    <i class="ri-menu-line text-xl"></i>
                </button>
            </div>
        </div>
    </div>
</nav>

<!-- Mobile Menu Vault -->
<Vault isOpen={mobileMenuOpen} on:close={closeMobileMenu}>
    <div class="space-y-4">
        {#each navbarItems as item (item.title)}
            <div class="py-2">
                <a href={item.href} class="block text-lg font-medium {item.disabled ? 'cursor-not-allowed opacity-50' : 'hover:cursor-pointer'} transition-colors duration-200" on:click={closeMobileMenu}>
                    {item.title}
                    {#if item.disabled}
                        <Badge variant="destructive" class="ml-2">Soon</Badge>
                    {/if}
                </a>
            </div>
        {/each}
        {#if isValid}
            <div class="py-2">
                <a href="/profile" class="block text-lg font-medium transition-colors duration-200" on:click={closeMobileMenu}>
                    Profile
                </a>
            </div>
        {/if}
    </div>
</Vault>
