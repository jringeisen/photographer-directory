<script setup>
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import debounce from 'lodash-es/debounce';

const props = defineProps({
    filters: Object,
});

const search = ref(props.filters?.q || '');

const performSearch = debounce(() => {
    router.get('/', {
        q: search.value || undefined,
    }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}, 300);

watch([search], () => {
    performSearch();
});

</script>

<template>
    <div class="w-full max-w-4xl mx-auto">
        <div class="relative">
            <input
                v-model="search"
                type="text"
                placeholder="Try “wedding photographers in Panama City, FL”"
                class="w-full px-6 py-4 pl-14 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
            />
            <svg class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    </div>
</template>
