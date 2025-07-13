<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    const navigateToHome = () => {
        goto('/');
    };
</script>

<div class="flex flex-col items-center justify-center h-screen w-full px-4 text-center">
    <h2 class="text-4xl font-semibold text-white mb-2">404</h2>
    <p class="text-lg text-gray-300 mb-4">Page not found.</p>
    <Button variant="default" onclick={navigateToHome}>
        Go to Homepage
    </Button>
</div>