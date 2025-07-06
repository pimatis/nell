<script>
    import * as Card from "$lib/components/ui/card";
    import Footer from "../../components/Footer.svelte";
</script>

<div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p class="text-lg opacity-80 max-w-2xl mx-auto">
                Your privacy is important to us. This privacy policy explains our minimal data collection approach and how we protect your privacy when you use Nell.
            </p>
            <p class="text-sm opacity-60 mt-4">Last updated: July 6, 2025</p>
        </div>

        <div class="space-y-6">
            <!-- Information We Collect -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-information-line"></i>
                        Information We Collect
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
                        <h3 class="font-semibold mb-2">No Personal Information Collected</h3>
                        <p class="text-sm opacity-80">
                            Nell does not require account creation or collect any personal information such as email addresses, names, or profile data. 
                            Our service is designed to work completely anonymously without storing any user data.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Local Storage Only</h3>
                        <p class="text-sm opacity-80">
                            All your chat conversations and preferences are stored locally in your browser only. 
                            We do not have access to or store any of your chat history or personal conversations on our servers.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Minimal Technical Data</h3>
                        <p class="text-sm opacity-80">
                            We only collect minimal technical information necessary for the service to function, 
                            such as anonymous usage analytics to help us improve the service. No personal identifiers are collected.
                        </p>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- How We Use Your Information -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-settings-3-line"></i>
                        How We Use Your Information
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
                        <h3 class="font-semibold mb-2">Anonymous Service Delivery</h3>
                        <p class="text-sm opacity-80">
                            Since we don't collect or store any personal information, our service operates completely anonymously. 
                            Your conversations are processed in real-time without creating any permanent records.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">AI Model Processing</h3>
                        <p class="text-sm opacity-80">
                            Your chat messages are sent to AI service providers (such as OpenAI, Anthropic, etc.) to generate responses. 
                            These messages are processed in real-time and are not permanently stored by us.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Service Improvement</h3>
                        <p class="text-sm opacity-80">
                            We may use anonymous usage analytics to improve our service performance and user experience. 
                            This data contains no personal identifiers and cannot be traced back to individual users.
                        </p>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Data Sharing -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-share-line"></i>
                        Data Sharing and Disclosure
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
                        <h3 class="font-semibold mb-2">AI Service Providers</h3>
                        <p class="text-sm opacity-80">
                            Your chat messages are shared with third-party AI service providers (OpenAI, Anthropic, Google, etc.) 
                            to generate responses. These providers have their own privacy policies and data handling practices.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">No Data Storage or Sharing</h3>
                        <p class="text-sm opacity-80">
                            We do not store, share, or sell any personal information because we don't collect any. 
                            Your conversations exist only in your browser's local storage and in real-time processing.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Legal Compliance</h3>
                        <p class="text-sm opacity-80">
                            Since we don't collect or store personal data, we have no user information to disclose 
                            even if legally required to do so.
                        </p>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Data Security -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-shield-check-line"></i>
                        Data Security
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <p class="text-sm opacity-80">
                        Since we don't collect or store any personal information, there is minimal security risk. 
                        However, we still implement security measures to protect our service:
                    </p>
                    <ul class="text-sm opacity-80 space-y-1 ml-4">
                        <li>• Secure HTTPS connections for all communications</li>
                        <li>• Regular security audits and updates</li>
                        <li>• Secure API communications with AI service providers</li>
                        <li>• No permanent data storage to minimize risk</li>
                    </ul>
                    <p class="text-sm opacity-80">
                        Your chat data is stored locally in your browser and is under your complete control. 
                        You can clear this data at any time through your browser settings.
                    </p>
                </Card.Content>
            </Card.Root>

            <!-- Your Rights -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-user-settings-line"></i>
                        Your Rights and Choices
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
                        <h3 class="font-semibold mb-2">Complete Control</h3>
                        <p class="text-sm opacity-80">
                            Since all your data is stored locally in your browser, you have complete control over it. 
                            You can clear your chat history and preferences at any time through your browser settings.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">No Account Required</h3>
                        <p class="text-sm opacity-80">
                            Our service doesn't require account creation, so there's no personal information to manage, 
                            update, or delete from our systems.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Data Portability</h3>
                        <p class="text-sm opacity-80">
                            Your chat data is stored in your browser's local storage and can be exported or transferred 
                            using standard browser tools if needed.
                        </p>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Cookies and Tracking -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-eye-2-line"></i>
                        Cookies and Tracking
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <p class="text-sm opacity-80">
                        We use minimal cookies and tracking technologies only when necessary:
                    </p>
                    <ul class="text-sm opacity-80 space-y-1 ml-4">
                        <li>• Essential cookies for service functionality</li>
                        <li>• Local storage for your chat history and preferences</li>
                        <li>• Anonymous analytics to improve service performance</li>
                    </ul>
                    <p class="text-sm opacity-80">
                        You can control these settings through your browser preferences. Disabling them may affect 
                        the functionality of our service, but no personal data will be lost.
                    </p>
                </Card.Content>
            </Card.Root>

            <!-- Children's Privacy -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-parent-line"></i>
                        Children's Privacy
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <p class="text-sm opacity-80">
                        Our service is suitable for users of all ages since we don't collect any personal information. 
                        However, we recommend parental supervision for children under 13 when using AI chat services 
                        to ensure appropriate conversations.
                    </p>
                </Card.Content>
            </Card.Root>

            <!-- International Users -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-global-line"></i>
                        International Users
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <p class="text-sm opacity-80">
                        Since we don't collect or store personal information, there is no user data to transfer internationally. 
                        However, your chat messages are processed by AI service providers that may be located in different countries.
                    </p>
                    <p class="text-sm opacity-80 mt-2">
                        For users in Turkey and other countries, please note that AI processing may occur in the United States 
                        or other countries where AI service providers operate. This processing is temporary and real-time only.
                    </p>
                </Card.Content>
            </Card.Root>

            <!-- Changes to Policy -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-file-edit-line"></i>
                        Changes to This Privacy Policy
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <p class="text-sm opacity-80">
                        We may update this privacy policy from time to time. Since we don't collect email addresses or 
                        personal information, we'll notify you of any significant changes by posting the updated policy on this page 
                        and updating the "Last updated" date. We recommend checking this page periodically for updates.
                    </p>
                </Card.Content>
            </Card.Root>

            <!-- Contact Information -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-mail-line"></i>
                        Contact Us
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <p class="text-sm opacity-80">
                        If you have any questions about this privacy policy or our privacy practices, please contact us:
                    </p>
                    <div class="bg-secondary/20 p-4 rounded-lg">
                        <p class="text-sm opacity-80">
                            <strong>Email:</strong> privacy@nell.org
                        </p>
                    </div>
                    <p class="text-sm opacity-60">
                        We will respond to your privacy-related inquiries within 30 days.
                    </p>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>

<Footer />