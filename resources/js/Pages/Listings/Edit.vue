<script setup>
import { useForm, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import ImageUploader from '@/Components/ImageUploader.vue';
import PhotographyTypeSelector from '@/Components/PhotographyTypeSelector.vue';
import TiptapEditor from '@/Components/TiptapEditor.vue';

const props = defineProps({
    listing: Object,
    photographyTypes: Array,
});

const form = useForm({
    company_name: props.listing.company_name,
    city: props.listing.city,
    state: props.listing.state,
    phone: props.listing.phone || '',
    email: props.listing.email || '',
    description: props.listing.description || '',
    photography_types: props.listing.photography_types.map(t => t.id),
    custom_types: [],
    uploaded_images: [],
    remove_images: [],
});

const removedImageIds = ref([]);

const handleRemoveExisting = (imageId) => {
    removedImageIds.value.push(imageId);
    form.remove_images = removedImageIds.value;
};

const submit = () => {
    form.transform((data) => ({
        ...data,
        _method: 'PUT',
    })).post(`/listings/${props.listing.id}`);
};
</script>

<template>
    <AppLayout>
        <div class="mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Edit Listing</h1>
                    <p class="text-sm text-gray-600">{{ listing.company_name }}</p>
                </div>
            </div>

            <form @submit.prevent="submit" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div class="lg:col-span-2 space-y-6">
                    <div class="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-gray-900">Listing Details</h2>
                            <span class="text-xs font-medium text-blue-600">Required *</span>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                                Company Name *
                            </label>
                            <input
                                v-model="form.company_name"
                                type="text"
                                required
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p v-if="form.errors.company_name" class="text-sm text-red-600">
                                {{ form.errors.company_name }}
                            </p>
                        </div>

                        <div class="grid gap-4 md:grid-cols-2">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    City *
                                </label>
                                <input
                                    v-model="form.city"
                                    type="text"
                                    required
                                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p v-if="form.errors.city" class="text-sm text-red-600">
                                    {{ form.errors.city }}
                                </p>
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    State *
                                </label>
                                <input
                                    v-model="form.state"
                                    type="text"
                                    required
                                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p v-if="form.errors.state" class="text-sm text-red-600">
                                    {{ form.errors.state }}
                                </p>
                            </div>
                        </div>

                        <div class="grid gap-4 md:grid-cols-2">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    Phone
                                </label>
                                <input
                                    v-model="form.phone"
                                    type="tel"
                                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p v-if="form.errors.phone" class="text-sm text-red-600">
                                    {{ form.errors.phone }}
                                </p>
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    v-model="form.email"
                                    type="email"
                                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p v-if="form.errors.email" class="text-sm text-red-600">
                                    {{ form.errors.email }}
                                </p>
                            </div>
                        </div>
                        <p class="text-sm text-gray-500">At least one contact method required.</p>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <TiptapEditor
                                v-model="form.description"
                                placeholder="Tell potential clients about your photography business..."
                            />
                            <p v-if="form.errors.description" class="text-sm text-red-600">
                                {{ form.errors.description }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
                        <h2 class="text-lg font-semibold text-gray-900">Photography Types</h2>
                        <p class="text-sm text-gray-600">Update your specialties to reach the right clients.</p>
                        <PhotographyTypeSelector
                            :photography-types="photographyTypes"
                            v-model="form.photography_types"
                            v-model:custom-types="form.custom_types"
                        />
                        <p v-if="form.errors.photography_types" class="text-sm text-red-600">
                            {{ form.errors.photography_types }}
                        </p>
                    </div>

                    <div class="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-gray-900">Showcase Images</h2>
                            <span class="text-xs text-gray-500">Up to 10 images</span>
                        </div>
                        <ImageUploader
                            v-model="form.uploaded_images"
                            :existing-images="listing.images"
                            :max-images="10"
                            purpose="listing"
                            @remove-existing="handleRemoveExisting"
                        />
                        <p v-if="form.errors.uploaded_images" class="text-sm text-red-600">
                            {{ form.errors.uploaded_images }}
                        </p>
                    </div>
                </div>

                <div class="lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                        href="/dashboard"
                        class="rounded-md px-4 py-2 text-center text-gray-700 hover:text-gray-900"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        <span v-if="form.processing">Saving...</span>
                        <span v-else>Save Changes</span>
                    </button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
