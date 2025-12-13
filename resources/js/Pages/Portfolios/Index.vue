<script setup>
import { Link, router } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';

const props = defineProps({
    listing: Object,
});

const deletePortfolio = (portfolio) => {
    if (confirm(`Are you sure you want to delete "${portfolio.name}"? This will also delete all images.`)) {
        router.delete(`/portfolios/${portfolio.id}`);
    }
};
</script>

<template>
    <AppLayout>
        <div class="max-w-4xl mx-auto">
            <div class="mt-12 bg-white rounded-lg border border-gray-200 p-6">
                <!-- Header -->
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Portfolios</h1>
                        <p class="text-gray-600 mt-1">
                            For: <Link :href="`/listings/${listing.id}/edit`" class="font-medium text-primary-600 hover:underline">{{ listing.company_name }}</Link>
                        </p>
                    </div>
                    <Link
                        :href="`/listings/${listing.id}/portfolios/create`"
                        class="inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Portfolio
                    </Link>
                </div>

                <!-- Empty State -->
                <div v-if="listing.portfolios?.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
                    <p class="text-gray-500 mb-6">Create your first portfolio to showcase your work.</p>
                    <Link
                        :href="`/listings/${listing.id}/portfolios/create`"
                        class="inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Create Your First Portfolio
                    </Link>
                </div>

                <!-- Portfolios Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        v-for="portfolio in listing.portfolios"
                        :key="portfolio.id"
                        class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <!-- Thumbnail -->
                        <div class="aspect-video bg-gray-100 relative">
                            <img
                                v-if="portfolio.images?.[0]"
                                :src="portfolio.images[0].url"
                                :alt="portfolio.name"
                                class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 mb-1">{{ portfolio.name }}</h3>
                            <p class="text-sm text-gray-500 mb-4">
                                {{ portfolio.images?.length || 0 }} images
                            </p>

                            <!-- Actions -->
                            <div class="flex gap-2">
                                <Link
                                    :href="`/portfolios/${portfolio.id}/edit`"
                                    class="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    @click="deletePortfolio(portfolio)"
                                    class="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Back Link -->
                <div class="mt-8 pt-6 border-t border-gray-200">
                    <Link href="/dashboard" class="text-primary-600 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
