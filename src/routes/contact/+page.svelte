<script>
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";

    let name = "";
    let email = "";
    let message = "";
    let isSubmitting = false;
    let submitStatus = { success: false, message: "" };

    async function handleSubmit() {
        if (!name || !email || !message) {
            submitStatus = { success: false, message: "Please fill out all fields!" };
            return;
        }
        
        isSubmitting = true;
        submitStatus = { success: true, message: "Sending message..." };
        
        await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, message }),
        }).then(() => {
            submitStatus = { 
                success: true, 
                message: "Message sent! We will get back to you as soon as possible. If you don't hear from us within 24 hours, it's probably because our mail pigeon got lost." 
            };

            name = "";
            email = "";
            message = "";
            isSubmitting = false;
        });
    }
</script>

<Navbar />

<div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Contact Us</h1>
            <p class="text-lg opacity-80 max-w-2xl mx-auto">
                Have a question? Got a suggestion? Just want to say hi?
                Fill out the form below and we will get back to you as soon as possible. (Unless our mail pigeon gets lost)
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Contact Form -->
            <div>
                <Card.Root class="h-full">
                    <Card.Header>
                        <Card.Title>Send Message</Card.Title>
                        <Card.Description>Fill out the form below to send us a message</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium mb-1">Name</label>
                                <Input bind:value={name} id="name" placeholder="Your name" class="w-full" />
                            </div>
                            
                            <div>
                                <label for="email" class="block text-sm font-medium mb-1">Email</label>
                                <Input bind:value={email} type="email" id="email" placeholder="your@email.com" class="w-full" />
                            </div>
                            
                            <div>
                                <label for="message" class="block text-sm font-medium mb-1">Message</label>
                                <Textarea bind:value={message} id="message" placeholder="Your message..." class="w-full resize-none" />
                            </div>
                            
                            {#if submitStatus.message}
                                <div class={`p-3 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                    {submitStatus.message}
                                </div>
                            {/if}
                            
                            <Button type="submit" disabled={isSubmitting || !name || !email || !message} class="w-full">
                                {isSubmitting ? 'Sending...' : 'Send'}
                            </Button>
                        </form>
                    </Card.Content>
                </Card.Root>
            </div>

            <!-- Contact Info -->
            <div class="space-y-6">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Contact Information</Card.Title>
                        <Card.Description>Other ways to contact us</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div class="px-2 py-1 bg-secondary rounded-full">
                                <i class="ri-mail-fill text-primary text-xl"></i>
                            </div>
                            <div>
                                <h3 class="font-medium">Email</h3>
                                <p class="text-sm opacity-80 hover:underline"><a href="mailto:hi@nell.org">hi@nell.org</a></p>
                                <p class="text-xs opacity-80 mt-1">(Response time: 24-48 hours. Sometimes 5 minutes)</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                            <div class="px-2 py-1 bg-secondary rounded-full">
                                <i class="ri-discord-fill text-primary text-xl"></i>
                            </div>
                            <div>
                                <h3 class="font-medium">Discord</h3>
                                <p class="text-sm opacity-80 hover:underline"><a href="https://discord.gg/askn3ll">discord.gg/askn3ll</a></p>
                                <p class="text-xs opacity-80 mt-1">(Live support!)</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                            <div class="px-2 py-1 bg-secondary rounded-full">
                                <i class="ri-twitter-x-fill text-primary text-xl"></i>
                            </div>
                            <div>
                                <h3 class="font-medium">Twitter</h3>
                                <p class="text-sm opacity-80 hover:underline"><a href="https://twitter.com/askn3ll">twitter.com/askn3ll</a></p>
                                <p class="text-xs opacity-80 mt-1">(Updates and announcements)</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
                
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Frequently Asked Questions</Card.Title>
                        <Card.Description>Maybe you're wondering the same things</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="space-y-2">
                            <h4 class="font-medium">What are your working hours?</h4>
                            <p class="text-sm opacity-80">We work 24/7! Okay, not us, but our AI's do. Our human team is available Monday to Friday, 9am to 6pm.</p>
                        </div>
                        
                        <div class="space-y-2">
                            <h4 class="font-medium">Can I suggest a feature?</h4>
                            <p class="text-sm opacity-80">Yes, please! We love feature requests. The most creative ones might even get a surprise gift!</p>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        </div>
    </div>
</div>

<Footer />
