<script>
    let footerLinks = [
        {
            title: "Terms",
            href: "/terms"
        },
        {
            title: "Privacy Policy",
            href: "/privacy"
        },
        {
            title: "X (Twitter)",
            href: "https://x.com/askn3ll",
            external: true
        }
    ];
</script>

<footer class="w-full max-w-7xl mx-auto px-4 mt-20 py-5 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <!-- Logo ve Copyright -->
        <div class="flex flex-col items-center sm:items-start space-y-2">
            <div class="flex items-center space-x-1 text-xs opacity-60">
                <i class="ri-copyright-line"></i>
                <span>Nell</span>
            </div>
        </div>

        <!-- Links -->
        <div class="flex items-center space-x-6">
            {#each footerLinks as link}
                <a href={link.href} class="text-xs opacity-60 hover:opacity-100 transition-all duration-300" target={link.external ? "_blank" : "_self"} rel={link.external ? "noopener noreferrer" : ""}>
                    {link.title}
                    {#if link.external}
                        <i class="ri-external-link-line ml-1"></i>
                    {/if}
                </a>
            {/each}
        </div>
    </div>
</footer>
