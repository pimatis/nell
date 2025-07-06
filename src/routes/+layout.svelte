<script lang="ts">
	import '../app.css';
    import posthog from "posthog-js";
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

	let { children } = $props();

    onMount(() => {
        if (browser) {
            posthog.init(import.meta.env.VITE_APP_POSTHOG_KEY, {
                api_host: 'https://us.i.posthog.com',
                defaults: '2025-05-24',
                person_profiles: 'always'
            })
        }
    });
</script>

{@render children()}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

    :global(body) {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
        justify-content: center;
        background-color: #120f15;
        color: #ffffffc4;
    }
</style>
