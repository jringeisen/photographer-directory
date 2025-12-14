<script setup>
import { Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import ConfirmDialog from '@/Components/ConfirmDialog.vue';

const props = defineProps({
    listing: Object,
});

const pendingDelete = ref(null);

const promptDelete = (portfolio) => {
    pendingDelete.value = portfolio;
};

const deletePortfolio = () => {
    if (!pendingDelete.value) {
        return;
    }

    router.delete(`/portfolios/${pendingDelete.value.id}`, {
        onFinish: () => {
            pendingDelete.value = null;
        },
    });
};
</script>

<template>
    <AppLayout>
        <div class="max-w-4xl mx-auto px-4 sm:px-0">
            <div class="mt-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <!-- Header -->
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Portfolios</h1>
                        <p class="text-gray-600 dark:text-gray-300 mt-1">
                            For: <Link :href="`/listings/${listing.id}/edit`" class="font-medium text-primary-600 dark:text-primary-400 hover:underline">{{ listing.company_name }}</Link>
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
                    <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No portfolios yet</h3>
                    <p class="text-gray-500 dark:text-gray-400 mb-6">Create your first portfolio to showcase your work.</p>
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
                        class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md hover:shadow-primary-500/10 transition-shadow bg-white dark:bg-gray-800"
                    >
                        <!-- Thumbnail -->
                        <div class="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                            <img
                                v-if="portfolio.images?.[0]"
                                :src="portfolio.images[0].url"
                                :alt="portfolio.name"
                                class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <svg class="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ portfolio.name }}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {{ portfolio.images?.length || 0 }} images
                            </p>

                            <!-- Actions -->
                            <div class="flex gap-2">
                                <Link
                                    :href="`/portfolios/${portfolio.id}/edit`"
                                    class="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    @click="promptDelete(portfolio)"
                                    class="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Back Link -->
                <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <Link href="/dashboard" class="text-primary-600 dark:text-primary-400 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>

        <ConfirmDialog
            :show="!!pendingDelete"
            title="Delete portfolio?"
            :message="pendingDelete ? `Deleting ${pendingDelete.name} will remove its images. This cannot be undone.` : ''"
            confirm-text="Delete"
            cancel-text="Cancel"
            @update:show="pendingDelete = null"
            @confirm="deletePortfolio"
        />
    </AppLayout>
</template>
