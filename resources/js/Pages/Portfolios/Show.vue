<script setup>
import { Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import ImageGallery from '@/Components/ImageGallery.vue';
import ConfirmDialog from '@/Components/ConfirmDialog.vue';

const props = defineProps({
    portfolio: Object,
    canManage: {
        type: Boolean,
        default: false,
    },
});

const pendingDelete = ref(false);

const deletePortfolio = () => {
    router.delete(`/portfolios/${props.portfolio.id}`, {
        onFinish: () => {
            pendingDelete.value = false;
        },
    });
};
</script>

<template>
    <AppLayout>
        <div class="max-w-4xl mx-auto px-4 sm:px-0">
            <!-- Header -->
            <div class="mt-12 flex justify-between items-start mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                        {{ portfolio.name }}
                    </h1>
                    <p class="text-gray-600 dark:text-gray-300 mt-1">
                        From: <Link :href="`/listings/${portfolio.listing.id}`" class="text-blue-600 dark:text-blue-400 hover:underline">
                            {{ portfolio.listing.company_name }}
                        </Link>
                    </p>
                </div>
                <div v-if="canManage" class="flex gap-2">
                    <Link
                        :href="`/portfolios/${portfolio.id}/edit`"
                        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Edit
                    </Link>
                    <button
                        @click="pendingDelete = true"
                        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <!-- Description -->
            <div v-if="portfolio.description" class="bg-white prose-lg dark:bg-gray-900 rounded-lg shadow p-6 mb-8 border border-gray-200 dark:border-gray-800">
                <p class="text-gray-700 dark:text-gray-200 whitespace-pre-line" v-html="portfolio.description" />
            </div>

            <!-- Images -->
            <div v-if="portfolio.images?.length > 0" class="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {{ portfolio.images.length }} Images
                </h2>
                <ImageGallery :images="portfolio.images" />
            </div>

            <div v-else class="bg-white dark:bg-gray-900 rounded-lg shadow p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800">
                No images in this portfolio yet.
                <Link
                    v-if="canManage"
                    :href="`/portfolios/${portfolio.id}/edit`"
                    class="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                    Add some images
                </Link>
            </div>

            <!-- Back Link -->
            <div class="mt-6">
                <Link :href="`/listings/${portfolio.listing.id}`" class="text-blue-600 dark:text-blue-400 hover:underline">
                    &larr; Back to {{ portfolio.listing.company_name }}
                </Link>
            </div>
        </div>

        <ConfirmDialog
            :show="canManage && pendingDelete"
            title="Delete portfolio?"
            message="This will remove the portfolio and its images. This cannot be undone."
            confirm-text="Delete"
            cancel-text="Cancel"
            @update:show="pendingDelete = $event"
            @confirm="deletePortfolio"
        />
    </AppLayout>
</template>
