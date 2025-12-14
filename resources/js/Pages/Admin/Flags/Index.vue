<script setup>
import { ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';

const props = defineProps({
    flags: Object,
    filters: Object,
    statuses: Array,
});

const notes = ref({});

const updateStatus = (flagId, action) => {
    router.post(`/admin/flags/${flagId}/${action}`, {
        admin_notes: notes.value[flagId] || '',
    }, {
        preserveScroll: true,
    });
};

const changeStatusFilter = (status) => {
    router.get('/admin/flags', { status }, {
        preserveState: true,
        replace: true,
    });
};
</script>

<template>
    <Head title="Flagged Listings" />
    <AppLayout>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Moderation</p>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Flagged Listings</h1>
                </div>
                <div class="flex items-center gap-3">
                    <select
                        :value="filters.status"
                        @change="changeStatusFilter($event.target.value)"
                        class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                    >
                        <option v-for="status in statuses" :key="status" :value="status">
                            {{ status }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table class="w-full">
                    <thead class="bg-gray-100 dark:bg-gray-800/70">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Listing</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Reporter</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Reason</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Notes</th>
                            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        <tr v-for="flag in flags.data" :key="flag.id" class="bg-white dark:bg-gray-900">
                            <td class="px-4 py-3">
                                <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                    <Link :href="`/listings/${flag.listing.id}`" class="hover:text-primary-500">
                                        {{ flag.listing.company_name }}
                                    </Link>
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">Status: {{ flag.status }}</div>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                <div v-if="flag.reporter">
                                    {{ flag.reporter.name }}
                                    <span class="text-xs text-gray-500 dark:text-gray-400 block">{{ flag.reporter.email }}</span>
                                </div>
                                <div v-else class="text-gray-500 dark:text-gray-400 text-sm">Unknown</div>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 max-w-xs">
                                {{ flag.reason }}
                            </td>
                            <td class="px-4 py-3">
                                <textarea
                                    v-model="notes[flag.id]"
                                    rows="2"
                                    class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    :placeholder="flag.admin_notes || 'Add note'"
                                ></textarea>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex flex-col sm:flex-row gap-2 justify-end">
                                    <button
                                        class="px-3 py-1.5 text-sm font-semibold rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 hover:bg-emerald-200"
                                        @click="updateStatus(flag.id, 'resolve')"
                                    >
                                        Resolve
                                    </button>
                                    <button
                                        class="px-3 py-1.5 text-sm font-semibold rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200 hover:bg-red-200"
                                        @click="updateStatus(flag.id, 'reject')"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="flags.data.length === 0">
                            <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                No flags found for this filter.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="flags.links?.length" class="mt-4 flex flex-wrap gap-2 justify-center">
                <Link
                    v-for="link in flags.links"
                    :key="link.label"
                    :href="link.url || '#'"
                    preserve-scroll
                    :class="[
                        'px-3 py-2 rounded-lg text-sm',
                        link.active
                            ? 'bg-primary-500 text-white'
                            : link.url
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    ]"
                    v-html="link.label"
                />
            </div>
        </div>
    </AppLayout>
</template>
