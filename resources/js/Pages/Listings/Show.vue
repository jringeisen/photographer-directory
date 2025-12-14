<script setup>
import { ref } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import ImageGallery from '@/Components/ImageGallery.vue';
import ConfirmDialog from '@/Components/ConfirmDialog.vue';

const props = defineProps({
    listing: Object,
});

const pendingDelete = ref(false);

const deleteListing = () => {
    router.delete(`/listings/${props.listing.id}`, {
        onFinish: () => {
            pendingDelete.value = false;
        },
    });
};
</script>

<template>
    <AppLayout>
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">
                        {{ listing.company_name }}
                    </h1>
                    <p class="text-lg text-gray-600 mt-1">
                        {{ listing.city }}, {{ listing.state }}
                    </p>
                </div>
                <div class="flex gap-2">
                    <Link
                        :href="`/listings/${listing.id}/edit`"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
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

            <!-- Showcase Images -->
            <div v-if="listing.images?.length > 0" class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Showcase Images</h2>
                <ImageGallery :images="listing.images" />
            </div>

            <!-- Details Card -->
            <div class="bg-white rounded-lg shadow p-6 mb-8">
                <!-- Contact Info -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Contact</h3>
                    <div class="space-y-1 text-gray-600">
                        <p v-if="listing.phone">
                            <span class="font-medium">Phone:</span> {{ listing.phone }}
                        </p>
                        <p v-if="listing.email">
                            <span class="font-medium">Email:</span> {{ listing.email }}
                        </p>
                    </div>
                </div>

                <!-- Photography Types -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Specialties</h3>
                    <div class="flex flex-wrap gap-2">
                        <span
                            v-for="type in listing.photography_types"
                            :key="type.id"
                            class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                            {{ type.name }}
                        </span>
                    </div>
                </div>

                <!-- Description -->
                <div v-if="listing.description">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">About</h3>
                    <p class="text-gray-600 whitespace-pre-line">{{ listing.description }}</p>
                </div>
            </div>

            <!-- Portfolios Section -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-gray-900">Portfolios</h2>
                    <Link
                        :href="`/listings/${listing.id}/portfolios/create`"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Add Portfolio
                    </Link>
                </div>

                <div v-if="listing.portfolios?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        v-for="portfolio in listing.portfolios"
                        :key="portfolio.id"
                        :href="`/portfolios/${portfolio.id}`"
                        class="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div class="flex items-center gap-4">
                            <div v-if="portfolio.images?.[0]" class="w-20 h-20 flex-shrink-0">
                                <img
                                    :src="portfolio.images[0].url"
                                    :alt="portfolio.name"
                                    class="w-full h-full object-cover rounded"
                                />
                            </div>
                            <div v-else class="w-20 h-20 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center">
                                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-medium text-gray-900">{{ portfolio.name }}</h3>
                                <p class="text-sm text-gray-500">
                                    {{ portfolio.images?.length || 0 }} images
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                <p v-else class="text-gray-500 text-center py-8">
                    No portfolios yet. Create one to showcase your work!
                </p>
            </div>

            <!-- Back Link -->
            <div class="mt-6">
                <Link href="/dashboard" class="text-blue-600 hover:underline">
                    &larr; Back to Dashboard
                </Link>
            </div>
        </div>
    </AppLayout>

    <ConfirmDialog
        :show="pendingDelete"
        title="Delete listing?"
        message="Deleting this listing will remove all portfolios and images. This cannot be undone."
        confirm-text="Delete"
        cancel-text="Cancel"
        @update:show="pendingDelete = $event"
        @confirm="deleteListing"
    />
</template>
