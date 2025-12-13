<script setup>
import { useForm, Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import ImageUploader from '@/Components/ImageUploader.vue';
import TiptapEditor from '@/Components/TiptapEditor.vue';

const props = defineProps({
    listing: Object,
});

const form = useForm({
    name: '',
    description: '',
    uploaded_images: [],
});

const submit = () => {
    form.post(`/listings/${props.listing.id}/portfolios`);
};
</script>

<template>
    <AppLayout>
        <div class="mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Create New Portfolio</h1>
                    <p class="text-sm text-gray-600">
                        For: <span class="font-medium">{{ listing.company_name }}</span>
                    </p>
                </div>
            </div>

            <form @submit.prevent="submit" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div class="lg:col-span-2 space-y-6">
                    <div class="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
                        <h2 class="text-lg font-semibold text-gray-900">Portfolio Details</h2>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                                Portfolio Name *
                            </label>
                            <input
                                v-model="form.name"
                                type="text"
                                required
                                placeholder="e.g., Smith Wedding 2024"
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p v-if="form.errors.name" class="text-sm text-red-600">
                                {{ form.errors.name }}
                            </p>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <TiptapEditor
                                v-model="form.description"
                                placeholder="Add some details about this portfolio..."
                            />
                            <p v-if="form.errors.description" class="text-sm text-red-600">
                                {{ form.errors.description }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-gray-900">Images</h2>
                            <span class="text-xs text-gray-500">Up to 50 images</span>
                        </div>
                        <ImageUploader
                            v-model="form.uploaded_images"
                            :max-images="50"
                            purpose="portfolio"
                        />
                        <p v-if="form.errors.uploaded_images" class="text-sm text-red-600">
                            {{ form.errors.uploaded_images }}
                        </p>
                    </div>
                </div>

                <div class="lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                        :href="`/listings/${listing.id}/portfolios`"
                        class="rounded-md px-4 py-2 text-center text-gray-700 hover:text-gray-900"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        <span v-if="form.processing">Creating...</span>
                        <span v-else>Create Portfolio</span>
                    </button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
