<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
</script>

<template>
    <AppLayout>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 space-y-8">
                <div>
                    <p class="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Policy</p>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
                    <p class="text-gray-600 dark:text-gray-300 mt-2">
                        How we collect, use, and protect your data when you browse, create listings, and contact photographers.
                    </p>
                </div>

                <div class="space-y-6 text-gray-700 dark:text-gray-200 leading-relaxed">
                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Information We Collect</h2>
                        <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
                            <li>Account details you provide when registering (name, email, password).</li>
                            <li>Listing and portfolio content you upload, including photos and descriptions.</li>
                            <li>Contact messages sent between clients and photographers.</li>
                            <li>Usage data (page views, device/browser info) to keep the platform reliable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">How We Use Your Information</h2>
                        <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
                            <li>Deliver core features like listings, portfolios, and in-app messaging.</li>
                            <li>Send notifications related to your account and inquiries.</li>
                            <li>Improve search, filters, and performance of the directory.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Data Sharing</h2>
                        <p>We do not sell your data. We share only what’s necessary with trusted providers (e.g., storage, email) to operate the service.</p>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your Choices</h2>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Update or delete your profile and listings from your dashboard.</li>
                            <li>Contact us to request data export or removal.</li>
                            <li>Opt out of non-essential notifications in your account settings (when available).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Security</h2>
                        <p>We use industry-standard security practices, access controls, and encrypted storage for sensitive assets.</p>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Contact</h2>
                        <p>If you have privacy questions, reach us at support@directory.local.</p>
                    </section>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
