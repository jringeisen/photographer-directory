<script setup>
import { useForm, Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import ImageUploader from '@/Components/ImageUploader.vue';
import PhotographyTypeSelector from '@/Components/PhotographyTypeSelector.vue';
import TiptapEditor from '@/Components/TiptapEditor.vue';

const props = defineProps({
    photographyTypes: Array,
});

const form = useForm({
    company_name: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    description: '',
    photography_types: [],
    custom_types: [],
    uploaded_images: [],
});

const submit = () => {
    form.post('/listings');
};
</script>

<template>
    <AppLayout>
        <div class="mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New Listing</h1>
                    <p class="text-sm text-gray-600 dark:text-gray-300">Tell clients who you are and showcase your best work.</p>
                </div>
            </div>

            <form @submit.prevent="submit" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div class="lg:col-span-2 space-y-6">
                    <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Listing Details</h2>
                            <span class="text-xs font-medium text-blue-600 dark:text-blue-300">Required *</span>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Company Name *
                            </label>
                            <input
                                v-model="form.company_name"
                                type="text"
                                required
                                class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p v-if="form.errors.company_name" class="text-sm text-red-500">
                                {{ form.errors.company_name }}
                            </p>
                        </div>

                        <div class="grid gap-4 md:grid-cols-2">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    City *
                                </label>
                                <input
                                    v-model="form.city"
                                    type="text"
                                    required
                                    class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p v-if="form.errors.city" class="text-sm text-red-500">
                                    {{ form.errors.city }}
                                </p>
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    State *
                                </label>
                                <input
                                    v-model="form.state"
                                    type="text"
                                    required
                                    class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p v-if="form.errors.state" class="text-sm text-red-500">
                                    {{ form.errors.state }}
                                </p>
                            </div>
                        </div>

                        <div class="grid gap-4 md:grid-cols-2">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Phone
                                </label>
                                <input
                                    v-model="form.phone"
                                    type="tel"
                                    class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p v-if="form.errors.phone" class="text-sm text-red-500">
                                    {{ form.errors.phone }}
                                </p>
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Email
                                </label>
                                <input
                                    v-model="form.email"
                                    type="email"
                                    class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p v-if="form.errors.email" class="text-sm text-red-500">
                                    {{ form.errors.email }}
                                </p>
                            </div>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">At least one contact method required.</p>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Description
                            </label>
                            <TiptapEditor
                                v-model="form.description"
                                placeholder="Tell potential clients about your photography business..."
                            />
                            <p v-if="form.errors.description" class="text-sm text-red-500">
                                {{ form.errors.description }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Photography Types</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Select your specialties so clients can find you faster.</p>
                        <PhotographyTypeSelector
                            :photography-types="photographyTypes"
                            v-model="form.photography_types"
                            v-model:custom-types="form.custom_types"
                        />
                        <p v-if="form.errors.photography_types" class="text-sm text-red-500">
                            {{ form.errors.photography_types }}
                        </p>
                    </div>

                    <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Showcase Images</h2>
                            <span class="text-xs text-gray-500 dark:text-gray-400">Up to 10 images</span>
                        </div>
                        <ImageUploader
                            v-model="form.uploaded_images"
                            :max-images="10"
                            purpose="listing"
                        />
                        <p v-if="form.errors.uploaded_images" class="text-sm text-red-500">
                            {{ form.errors.uploaded_images }}
                        </p>
                    </div>
                </div>

                <div class="lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                        href="/dashboard"
                        class="rounded-md px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        <span v-if="form.processing">Creating...</span>
                        <span v-else>Create Listing</span>
                    </button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
