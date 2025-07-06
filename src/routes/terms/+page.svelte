<script>
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import * as Card from "$lib/components/ui/card";
</script>

<svelte:head>
    <title>Terms of Service - Nell</title>
    <meta name="description" content="Read our terms of service and understand the rules and guidelines for using Nell." />
</svelte:head>

<Navbar />

<div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Terms of Service</h1>
            <p class="text-lg opacity-80 max-w-2xl mx-auto">
                Welcome to Nell. These terms of service govern your use of our AI chat platform and services.
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
                        Nell is an AI-powered chat platform that provides users with access to various artificial intelligence models 
                        for conversation, assistance, and information. Our service includes:
                    </p>
                    <ul class="text-sm opacity-80 space-y-1 ml-4">
                        <li>• Access to multiple AI models and chat interfaces</li>
                        <li>• Chat history and conversation management</li>
                        <li>• User account management and personalization</li>
                        <li>• Web search integration for enhanced responses</li>
                        <li>• Model selection and preference settings</li>
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
                        User Accounts
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
                        <h3 class="font-semibold mb-2">Account Creation</h3>
                        <p class="text-sm opacity-80">
                            To use certain features of our service, you must create an account. You agree to provide accurate, 
                            current, and complete information during the registration process.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Account Security</h3>
                        <p class="text-sm opacity-80">
                            You are responsible for maintaining the security of your account and password. 
                            You must notify us immediately of any unauthorized use of your account.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Account Termination</h3>
                        <p class="text-sm opacity-80">
                            We may terminate or suspend your account at any time for violation of these terms 
                            or for any other reason at our sole discretion.
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
                            You retain ownership of any content you submit to our service. However, by submitting content, 
                            you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display 
                            such content for the purpose of providing our service.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Our Content</h3>
                        <p class="text-sm opacity-80">
                            Our service and its original content, features, and functionality are owned by us and are protected 
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
                        Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                        to understand our practices regarding your personal information.
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
                        Payments and Subscriptions
                    </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
                        <h3 class="font-semibold mb-2">Subscription Plans</h3>
                        <p class="text-sm opacity-80">
                            We may offer various subscription plans with different features and usage limits. 
                            Subscription fees are charged in advance and are non-refundable.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Payment Processing</h3>
                        <p class="text-sm opacity-80">
                            Payments are processed through secure third-party payment processors. 
                            You agree to pay all fees and charges associated with your subscription.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2">Cancellation</h3>
                        <p class="text-sm opacity-80">
                            You may cancel your subscription at any time through your account settings. 
                            Cancellation will take effect at the end of the current billing period.
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
                        special, consequential, or punitive damages, including without limitation, loss of profits, 
                        data, use, goodwill, or other intangible losses.
                    </p>
                    <p class="text-sm opacity-80">
                        Our total liability to you for all damages shall not exceed the amount paid by you to us 
                        in the twelve (12) months preceding the event giving rise to the liability.
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
                        or your violation of any rights of another party.
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
                        Your continued use of our service after any changes constitutes your acceptance of the new terms.
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
                        <p class="text-sm opacity-80 mt-2">
                            <strong>Contact Form:</strong> <a href="/contact" class="underline hover:opacity-100">Visit our contact page</a>
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
