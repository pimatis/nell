<script>
    import Button from "$lib/components/ui/button/button.svelte";
</script>

<section class="flex justify-center items-center text-center flex-col py-10 sm:py-16 md:py-20">
    <div class="w-full max-w-5xl space-y-4 px-4 sm:px-8">
        <h1 class="text-3xl sm:text-5xl md:text-7xl font-black leading-tight">The World Keeps Turning, We Keep Automating.</h1>
        <p class="font-light opacity-80 text-sm sm:text-lg md:text-xl">Dealing with manual tasks is as nostalgic as inserting a CD. We accelerate your processes, minimize errors, and make human mistakes a thing of the past. If time is money, automation is wealth.</p>

        <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 justify-center items-center">
            <Button href="/signup" class="w-full sm:w-auto">Get Started</Button>
            <Button href="/about" class="w-full sm:w-auto" variant="outline">About Us</Button>
        </div>

        <span class="text-xs opacity-50 block mt-2">* No payment required to get started, let’s talk about that later.</span>
    </div>
</section>
