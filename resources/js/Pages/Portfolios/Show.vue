<script setup>
import { Link, router } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import ImageGallery from '@/Components/ImageGallery.vue';

const props = defineProps({
    portfolio: Object,
});

const deletePortfolio = () => {
    if (confirm('Are you sure you want to delete this portfolio?')) {
        router.delete(`/portfolios/${props.portfolio.id}`);
    }
};
</script>

<template>
    <AppLayout>
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">
                        {{ portfolio.name }}
                    </h1>
                    <p class="text-gray-600 mt-1">
                        From: <Link :href="`/listings/${portfolio.listing.id}`" class="text-blue-600 hover:underline">
                            {{ portfolio.listing.company_name }}
                        </Link>
                    </p>
                </div>
                <div class="flex gap-2">
                    <Link
                        :href="`/portfolios/${portfolio.id}/edit`"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Edit
                    </Link>
                    <button
                        @click="deletePortfolio"
                        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <!-- Description -->
            <div v-if="portfolio.description" class="bg-white rounded-lg shadow p-6 mb-8">
                <p class="text-gray-600 whitespace-pre-line">{{ portfolio.description }}</p>
            </div>

            <!-- Images -->
            <div v-if="portfolio.images?.length > 0" class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">
                    {{ portfolio.images.length }} Images
                </h2>
                <ImageGallery :images="portfolio.images" />
            </div>

            <div v-else class="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No images in this portfolio yet.
                <Link :href="`/portfolios/${portfolio.id}/edit`" class="text-blue-600 hover:underline ml-1">
                    Add some images
                </Link>
            </div>

            <!-- Back Link -->
            <div class="mt-6">
                <Link :href="`/listings/${portfolio.listing.id}`" class="text-blue-600 hover:underline">
                    &larr; Back to {{ portfolio.listing.company_name }}
                </Link>
            </div>
        </div>
    </AppLayout>
</template>
