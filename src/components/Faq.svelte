<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";

    let faqItems = [
        {
            question: "What is Nell and how does it work?",
            answer: "Nell brings all popular AI providers under one roof. Need ChatGPT, Claude, Gemini? All here, one API. We handle the automation so you don't get confused. Yes, really."
        },
        {
            question: "Which AI providers do you support?",
            answer: "ChatGPT, Claude 4, Google Gemini, and more. The list keeps growing because the AI world changes fast. Don’t worry about keeping up, —we’ll add them. One API, endless models. (We’re not exaggerating, almost endless.)"
        },
        {
            question: "How does pricing work?",
            answer: "$5 per month. Yes, you heard right. Unlimited AI for the price of a coffee. While your wallet cries on other platforms, you can use AI here comfortably. Premium? Of course."
        },
        {
            question: "How easy is API integration?",
            answer: "Just one API endpoint, that’s it. Even easier than copy-paste. Documentation and sample code? We have those too. If you can’t integrate in minutes, you probably don’t have internet."
        },
        {
            question: "How do I get technical support?",
            answer: "24/7 technical support. Live chat, email, documentation... We even have a developer community. Ask your question at 3am, you’ll get an answer. (We probably don’t sleep.)"
        },
        {
            question: "Which programming languages do you support?",
            answer: "Since it’s a REST API: Python, JavaScript, PHP, Java, C#, Go... Basically, anyone who can code can use it. We have SDKs too, of course. (If you want COBOL, let’s talk.)"
        }
    ];
</script>

<div class="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
    <div class="text-center">
        <h2 class="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Frequently Asked Questions</h2>
        <p class="text-xs sm:text-sm opacity-80">Find answers to your questions here. If you can't find what you're looking for, contact us!</p>
    </div>

    <div class="py-6 px-0 sm:px-4 sm:py-8 md:px-8 md:py-10">
        <Accordion.Root type="single" class="space-y-3 sm:space-y-4">
            {#each faqItems as item, index}
                <Accordion.Item value={"item-" + (index + 1)}>
                    <Accordion.Trigger>
                        <span>{item.question}</span>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <div>{item.answer}</div>
                    </Accordion.Content>
                </Accordion.Item>
            {/each}
        </Accordion.Root>
    </div>
</div>
