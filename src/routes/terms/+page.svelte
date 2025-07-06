<script>
    import * as Card from "$lib/components/ui/card";
    import Footer from "../../components/Footer.svelte";
</script>

<div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Terms of Service</h1>
            <p class="text-lg opacity-80 max-w-2xl mx-auto">
                Welcome to Nell. These terms of service govern your use of our anonymous AI chat platform and services.
            </p>
            <p class="text-sm opacity-60 mt-4">Last updated: July 6, 2025</p>
        </div>

        <div class="space-y-6">
            <!-- Acceptance of Terms -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-checkbox-circle-line"></i>
                        Acceptance of Terms
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <p class="text-sm opacity-80">
                        By accessing or using Nell, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
                        If you do not agree with any of these terms, you are prohibited from using or accessing this service.
                    </p>
                    <p class="text-sm opacity-80">
                        These terms apply to all visitors, users, and others who access or use the service.
                    </p>
                </Card.Content>
            </Card.Root>

            <!-- Description of Service -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-service-line"></i>
                        Description of Service
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <p class="text-sm opacity-80">
                        Nell is an anonymous AI-powered chat platform that provides users with access to various artificial intelligence models 
                        for conversation, assistance, and information. Our service includes:
                    </p>
                    <ul class="text-sm opacity-80 space-y-1 ml-4">
                        <li>• Access to multiple AI models and chat interfaces</li>
                        <li>• Local chat history management (stored in your browser only)</li>
                        <li>• Model selection and preference settings</li>
                        <li>• Web search integration for enhanced responses</li>
                        <li>• Completely anonymous usage - no account required</li>
                    </ul>
                    <p class="text-sm opacity-80">
                        We reserve the right to modify, suspend, or discontinue the service at any time without notice.
                    </p>
                </Card.Content>
            </Card.Root>

            <!-- User Accounts -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-user-line"></i>
                        Anonymous Usage
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
                        <h3 class="font-semibold mb-2">No Account Required</h3>
                        <p class="text-sm opacity-80">
                            Our service operates completely anonymously and does not require account creation. 
                            You can use Nell immediately without providing any personal information.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Local Data Storage</h3>
                        <p class="text-sm opacity-80">
                            Your chat history and preferences are stored locally in your browser. 
                            You are responsible for managing this local data and can clear it at any time.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Service Availability</h3>
                        <p class="text-sm opacity-80">
                            Since we don't maintain user accounts, we cannot provide personalized support or 
                            account recovery services. The service is provided as-is.
                        </p>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Acceptable Use -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-shield-check-line"></i>
                        Acceptable Use
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <p class="text-sm opacity-80">
                        You agree to use our service only for lawful purposes and in accordance with these terms. 
                        You agree not to use the service:
                    </p>
                    <ul class="text-sm opacity-80 space-y-1 ml-4">
                        <li>• To violate any applicable law or regulation</li>
                        <li>• To generate harmful, illegal, or inappropriate content</li>
                        <li>• To impersonate any person or entity</li>
                        <li>• To harass, abuse, or harm others</li>
                        <li>• To spam or send unsolicited communications</li>
                        <li>• To attempt to gain unauthorized access to our systems</li>
                        <li>• To interfere with the proper functioning of the service</li>
                        <li>• To reverse engineer or attempt to extract source code</li>
                    </ul>
                </Card.Content>
            </Card.Root>

            <!-- Content and Intellectual Property -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-copyright-line"></i>
                        Content and Intellectual Property
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
                        <h3 class="font-semibold mb-2">Your Content</h3>
                        <p class="text-sm opacity-80">
                            You retain full ownership of your conversations and any content you input. 
                            Your conversations are stored locally in your browser and are not permanently stored on our servers.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">AI Processing</h3>
                        <p class="text-sm opacity-80">
                            By using our service, you consent to your messages being processed by third-party AI service providers 
                            for the purpose of generating responses. This processing is temporary and real-time only.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Our Service</h3>
                        <p class="text-sm opacity-80">
                            Our service platform, interface, and functionality are owned by us and are protected 
                            by international copyright, trademark, and other intellectual property laws.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">AI-Generated Content</h3>
                        <p class="text-sm opacity-80">
                            Content generated by AI models through our service is provided "as is" and we make no claims 
                            about its accuracy, completeness, or suitability for any particular purpose.
                        </p>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Privacy -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-lock-line"></i>
                        Privacy
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <p class="text-sm opacity-80">
                        Your privacy is important to us. Please review our Privacy Policy, which explains our minimal data collection approach 
                        and how we protect your privacy while using our anonymous service.
                    </p>
                    <div class="bg-secondary/20 p-4 rounded-lg">
                        <p class="text-sm opacity-80">
                            <strong>Privacy Policy:</strong> <a href="/privacy" class="underline hover:opacity-100">Read our Privacy Policy</a>
                        </p>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Payments and Subscriptions -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-money-dollar-circle-line"></i>
                        Service Pricing
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
                        <h3 class="font-semibold mb-2">Free Service</h3>
                        <p class="text-sm opacity-80">
                            Our service is currently provided free of charge. We reserve the right to introduce 
                            paid features or subscription plans in the future with advance notice.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Future Payments</h3>
                        <p class="text-sm opacity-80">
                            If we introduce paid features, payments will be processed through secure third-party payment processors. 
                            Any paid features will be clearly marked and require explicit consent.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Service Changes</h3>
                        <p class="text-sm opacity-80">
                            We may modify our service offering at any time. Since we don't maintain user accounts, 
                            we cannot provide individual notifications about service changes.
                        </p>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Disclaimers -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-alert-line"></i>
                        Disclaimers
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
                        <h3 class="font-semibold mb-2">Service Availability</h3>
                        <p class="text-sm opacity-80">
                            We do not guarantee that our service will be available at all times. 
                            The service may be subject to interruptions, delays, or errors.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">AI Limitations</h3>
                        <p class="text-sm opacity-80">
                            AI-generated responses may be inaccurate, incomplete, or inappropriate. 
                            You should not rely solely on AI-generated content for important decisions.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Third-Party Services</h3>
                        <p class="text-sm opacity-80">
                            Our service may integrate with third-party services and APIs. 
                            We are not responsible for the availability or performance of these third-party services.
                        </p>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Limitation of Liability -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-shield-line"></i>
                        Limitation of Liability
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <p class="text-sm opacity-80">
                        To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
                        special, consequential, or punitive damages. Since we don't collect or store personal information, 
                        our liability is limited to the availability and functionality of our service.
                    </p>
                    <p class="text-sm opacity-80">
                        Our total liability to you for all damages shall not exceed the amount paid by you to us 
                        in the twelve (12) months preceding the event giving rise to the liability, or $100 USD if no payment was made.
                    </p>
                </Card.Content>
            </Card.Root>

            <!-- Indemnification -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-scales-line"></i>
                        Indemnification
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <p class="text-sm opacity-80">
                        You agree to indemnify and hold us harmless from any claims, damages, losses, costs, 
                        and expenses arising from your use of our service, your violation of these terms, 
                        or your violation of any rights of another party. This is limited to actions directly 
                        related to your use of our anonymous service.
                    </p>
                </Card.Content>
            </Card.Root>

            <!-- Governing Law -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-government-line"></i>
                        Governing Law
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <p class="text-sm opacity-80">
                        These terms shall be governed by and construed in accordance with the laws of the United States, 
                        without regard to its conflict of law provisions. Any disputes arising from these terms 
                        shall be resolved in the courts of competent jurisdiction.
                    </p>
                    <p class="text-sm opacity-80 mt-2">
                        If you are accessing our service from Turkey, please note that your information may be stored and processed in the United States and other countries where our service providers are located. By using our service, you consent to such data transfer.
                    </p>
                </Card.Content>
            </Card.Root>

            <!-- Changes to Terms -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <i class="ri-file-edit-line"></i>
                        Changes to Terms
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <p class="text-sm opacity-80">
                        We reserve the right to modify these terms at any time. We will notify you of any significant changes 
                        by posting the new terms on this page and updating the "Last updated" date. 
                        Since we don't collect email addresses, we recommend checking this page periodically for updates.
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
                        If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <div class="bg-secondary/20 p-4 rounded-lg">
                        <p class="text-sm opacity-80">
                            <strong>Email:</strong> legal@nell.org
                        </p>
                    </div>
                    <p class="text-sm opacity-60">
                        We will respond to your legal inquiries within 30 days.
                    </p>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>

<Footer />