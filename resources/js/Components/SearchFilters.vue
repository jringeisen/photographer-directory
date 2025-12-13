<script setup>
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import debounce from 'lodash-es/debounce';

const props = defineProps({
    photographyTypes: Array,
    locations: Array,
    filters: Object,
});

const search = ref(props.filters?.search || '');
const selectedType = ref(props.filters?.type || '');
const selectedLocation = ref(props.filters?.location || '');

const performSearch = debounce(() => {
    router.get('/', {
        search: search.value || undefined,
        type: selectedType.value || undefined,
        location: selectedLocation.value || undefined,
    }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}, 300);

watch([search, selectedType, selectedLocation], () => {
    performSearch();
});

const clearFilters = () => {
    search.value = '';
    selectedType.value = '';
    selectedLocation.value = '';
};

const hasFilters = () => {
    return search.value || selectedType.value || selectedLocation.value;
};
</script>

<template>
    <div class="w-full max-w-4xl mx-auto">
        <div class="relative">
            <input
                v-model="search"
                type="text"
                placeholder="Search photographers by name, location, or specialty..."
                class="w-full px-6 py-4 pl-14 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
            />
            <svg class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>

        <div class="flex flex-wrap gap-3 mt-4 items-center justify-center">
            <select
                v-model="selectedType"
                class="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
                <option value="">All Specialties</option>
                <option v-for="type in photographyTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                </option>
            </select>

            <select
                v-model="selectedLocation"
                class="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
                <option value="">All Locations</option>
                <option v-for="location in locations" :key="location" :value="location">
                    {{ location }}
                </option>
            </select>

            <button
                v-if="hasFilters()"
                @click="clearFilters"
                class="px-4 py-2.5 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
            >
                Clear filters
            </button>
        </div>
    </div>
</template>
