<script>
    import * as Card from "$lib/components/ui/card";

    let whyItems = [
        {
            icon: "ri-cpu-line",
            title: "Multiple AI Providers",
            desc: "GPT-4, Claude, Gemini... All in one place! Like the Avengers of the AI world!"
        },
        {
            icon: "ri-infinity-line",
            title: "Unlimited",
            desc: "No need for fancy words, unlimited and premium service just $5/month. Unlimited AI for the price of a coffee!"
        },
        {
            icon: "ri-plug-line",
            title: "Developer-Friendly API",
            desc: "One API for all AIs! It's like the Swiss Army knife of AI. Even copy-paste is harder!"
        },
        {
            icon: "ri-line-chart-line",
            title: "Budget Saver",
            desc: "We reduce your AI costs by 80%. While others empty your pockets, we just take the loose change!"
        }
    ];
</script>

<div class="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 md:px-8">
    <div class="text-center">
        <h2 class="text-3xl font-bold text-foreground mb-4">Why Choose Us?</h2>
        <p class="text-sm opacity-80">Because sticking to a single AI is like trying to watch TikTok on a Nokia 3310!</p>
    </div>

    <div class="py-8 px-0 sm:px-4 md:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {#each whyItems as item}
                <Card.Root>
                    <Card.Header>
                        <div class="w-14 h-14 sm:w-16 sm:h-16 border bg-primary/[2%] rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <i class="{item.icon} text-xl sm:text-2xl text-primary"></i>
                        </div>
                        <Card.Title class="text-center">{item.title}</Card.Title>
                        <Card.Description class="text-center">{item.desc}</Card.Description>
                    </Card.Header>
                </Card.Root>
            {/each}
        </div>
    </div>
</div>
