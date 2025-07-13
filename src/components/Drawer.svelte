<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    export let isOpen = false;

    const dispatch = createEventDispatcher();

    function handleBackdropClick() {
        dispatch('close');
    }

    function handleKeydown(event: any) {
        if (event.key === 'Escape') {
            dispatch('close');
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
    <div class="fixed inset-0 bg-black/50 bg-opacity-50 z-40 transition-opacity duration-300" on:click={handleBackdropClick} on:keydown={handleBackdropClick} role="button" tabindex="0"></div>

    <div class="fixed bottom-0 left-0 right-0 bg-primary z-50 rounded-t-xl shadow-2xl" transition:fly={{ y: 300, duration: 400, easing: quintOut }}>
        <div class="p-6">
            <div class="w-12 h-1 bg-secondary rounded-full mx-auto mb-6"></div>

            <div class="space-y-1">
                <slot />
            </div>
        </div>
    </div>
{/if}
