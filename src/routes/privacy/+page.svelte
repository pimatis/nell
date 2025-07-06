<script>
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import * as Card from "$lib/components/ui/card";
</script>

<Navbar />

<div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p class="text-lg opacity-80 max-w-2xl mx-auto">
                Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information when you use Nell.
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
                        <h3 class="font-semibold mb-2">Personal Information</h3>
                        <p class="text-sm opacity-80">
                            When you create an account, we collect your email address and any profile information you choose to provide. 
                            This information is used to identify your account and provide personalized services.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Usage Data</h3>
                        <p class="text-sm opacity-80">
                            We collect information about how you use our service, including your chat conversations, 
                            model preferences, and interaction patterns. This helps us improve our AI models and user experience.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Technical Information</h3>
                        <p class="text-sm opacity-80">
                            We automatically collect technical information such as your IP address, browser type, 
                            device information, and usage analytics through PostHog to help us understand and improve our service.
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
                        <h3 class="font-semibold mb-2">Service Provision</h3>
                        <p class="text-sm opacity-80">
                            We use your information to provide, maintain, and improve our AI chat services, 
                            including personalizing your experience and maintaining your chat history.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Communication</h3>
                        <p class="text-sm opacity-80">
                            We may use your email address to send you important service updates, 
                            security notifications, and respond to your inquiries.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Analytics and Improvement</h3>
                        <p class="text-sm opacity-80">
                            We analyze usage patterns to improve our AI models, fix bugs, and enhance the user experience. 
                            This includes analyzing conversation patterns to make our responses more helpful.
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
                        <h3 class="font-semibold mb-2">Third-Party Services</h3>
                        <p class="text-sm opacity-80">
                            We use third-party services like PostHog for analytics and various AI model providers for chat functionality. 
                            These services have their own privacy policies and we ensure they meet our privacy standards.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Legal Requirements</h3>
                        <p class="text-sm opacity-80">
                            We may disclose your information if required by law, court order, or to protect our rights, 
                            property, or safety, or that of our users or others.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Business Transfers</h3>
                        <p class="text-sm opacity-80">
                            In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                            as part of the transaction. We will notify you of any such change.
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
                        We implement appropriate technical and organizational measures to protect your personal information 
                        against unauthorized access, alteration, disclosure, or destruction. This includes:
                    </p>
                    <ul class="text-sm opacity-80 space-y-1 ml-4">
                        <li>• Encryption of data in transit and at rest</li>
                        <li>• Regular security audits and updates</li>
                        <li>• Access controls and authentication measures</li>
                        <li>• Secure hosting and database management</li>
                    </ul>
                    <p class="text-sm opacity-80">
                        However, no method of transmission over the internet or electronic storage is 100% secure. 
                        While we strive to protect your information, we cannot guarantee absolute security.
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
                        <h3 class="font-semibold mb-2">Account Management</h3>
                        <p class="text-sm opacity-80">
                            You can update your account information, change your password, and manage your preferences 
                            through your profile settings.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Data Access and Deletion</h3>
                        <p class="text-sm opacity-80">
                            You can request access to your personal data, request corrections, or request deletion of your account 
                            and associated data by contacting us through our contact form.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Chat History</h3>
                        <p class="text-sm opacity-80">
                            You can delete individual chats or your entire chat history through the chat interface. 
                            Deleted chats are permanently removed from our systems.
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
                        We use cookies and similar tracking technologies to enhance your experience:
                    </p>
                    <ul class="text-sm opacity-80 space-y-1 ml-4">
                        <li>• Essential cookies for authentication and security</li>
                        <li>• Analytics cookies through PostHog to understand usage patterns</li>
                        <li>• Preference cookies to remember your settings</li>
                    </ul>
                    <p class="text-sm opacity-80">
                        You can control cookie preferences through your browser settings, though disabling certain cookies 
                        may affect the functionality of our service.
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
                        Our service is not intended for children under 13 years of age. We do not knowingly collect 
                        personal information from children under 13. If we become aware that we have collected personal 
                        information from a child under 13, we will take steps to delete such information.
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
                        If you are accessing our service from outside the United States, please note that your information 
                        may be transferred to, stored, and processed in the United States and other countries where our 
                        service providers are located. By using our service, you consent to such transfer.
                    </p>
                    <p class="text-sm opacity-80 mt-2">
                        If you are accessing our service from Turkey, please note that your information may be stored and processed in the United States and other countries where our service providers are located. By using our service, you consent to such data transfer.
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
                        We may update this privacy policy from time to time. We will notify you of any significant changes 
                        by posting the new privacy policy on this page and updating the "Last updated" date. 
                        Your continued use of our service after any changes constitutes your acceptance of the new privacy policy.
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
                        <p class="text-sm opacity-80 mt-2">
                            <strong>Contact Form:</strong> <a href="/contact" class="underline hover:opacity-100">Visit our contact page</a>
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
