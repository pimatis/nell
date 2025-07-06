<script>
    import * as Card from "$lib/components/ui/card";

    let companies = [
        {
            logo: "https://www.upload.ee/image/17797875/pimatislogo-black.png",
            name: "Pimatis",
            desc: "A team developing open-source projects with various AI-powered and modern web technologies.",
            href: "https://github.com/pimatis"
        },
        {
            logo: "https://www.upload.ee/image/18263307/k9crypt.png",
            name: "K9Crypt",
            desc: "K9Crypt is a technology company providing a secure messaging platform. It enables users to create and share messages securely with end-to-end encryption.",
            href: "https://k9crypt.xyz"
        }
    ];
</script>

<div class="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 md:px-8">
    <div class="text-center">
        <h2 class="text-3xl font-bold text-foreground mb-4">Our Supporters</h2>
        <p class="text-sm opacity-80">Bold companies who trust us. These companies chose to invest in the AI future.</p>
    </div>

    <div class="py-8 px-0 sm:px-4 md:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {#each companies as company}
                <Card.Root>
                    <Card.Header>
                        <a href={company.href}>
                            <div class="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-4 mx-auto">
                                <img src={company.logo} alt="{company.name} Logo" class="w-10 h-10 sm:w-12 sm:h-12 object-contain">
                            </div>
                            <div class="space-y-2">
                                <Card.Title class="text-center">{company.name}</Card.Title>
                                <Card.Description class="text-center">{company.desc}</Card.Description>
                            </div>
                        </a>
                    </Card.Header>
                </Card.Root>
            {/each}
        </div>
    </div>
</div>
