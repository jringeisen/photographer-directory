<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
    title: String,
    description: String,
    buttonText: String,
    buttonHref: String,
});
</script>

<template>
    <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">{{ title }}</h3>
        <p class="mt-1 text-gray-500">{{ description }}</p>
        <div class="mt-6">
            <Link
                :href="buttonHref"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
                {{ buttonText }}
            </Link>
        </div>
    </div>
</template>
