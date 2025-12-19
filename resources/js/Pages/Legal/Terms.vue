<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
</script>

<template>
    <AppLayout>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 space-y-8">
                <div>
                    <p class="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Terms</p>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
                    <p class="text-gray-600 dark:text-gray-300 mt-2">
                        Guidelines for using the Photography Directory platform as a photographer or client.
                    </p>
                </div>

                <div class="space-y-6 text-gray-700 dark:text-gray-200 leading-relaxed">
                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Eligibility & Accounts</h2>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Provide accurate profile, listing, and portfolio information.</li>
                            <li>Maintain the security of your login credentials; you are responsible for activity under your account.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Acceptable Use</h2>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Share only content you own the rights to, and respect others’ intellectual property.</li>
                            <li>No spam, harassment, scraping, security testing, or misleading offers.</li>
                            <li>No nude, explicit, or pornographic content. Such content will be removed immediately and associated accounts may be deleted.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Listings & Portfolios</h2>
                        <p>
                            You’re responsible for the accuracy of your listings, pricing, and availability. You grant us
                            a license to host, display, resize, and optimize uploaded content (including images) to operate the platform.
                            We may moderate or remove content that violates these terms or applicable law.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Payments & Bookings</h2>
                        <p>If bookings or payments are enabled later, additional terms will apply. For now, inquiries and agreements are handled directly between clients and photographers.</p>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Third-Party Services</h2>
                        <p>We rely on third-party providers (e.g., cloud storage, email delivery, infrastructure). Service availability may depend on these providers.</p>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Availability & Changes</h2>
                        <p>The platform is provided “as is.” We may modify features, suspend access, or update these terms with notice when required. Continued use means you accept the latest version.</p>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Liability</h2>
                        <p>The platform is provided “as is.” We’re not liable for interactions or agreements between users, nor for third-party service interruptions.</p>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Termination</h2>
                        <p>We may suspend or remove accounts that violate these terms or harm the community.</p>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Contact</h2>
                        <p>Questions? Email support@directory.local.</p>
                    </section>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
