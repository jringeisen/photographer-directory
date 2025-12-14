<script setup>
import { Link, router } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';

const props = defineProps({
    requests: Object,
    filters: Object,
});

const changeStatus = (status) => {
    router.get('/admin/verification', { status }, { preserveState: true, preserveScroll: true });
};
</script>

<template>
    <AppLayout>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="flex items-start justify-between gap-3 mb-4">
                <div>
                    <p class="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Admin</p>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Verification Requests</h1>
                </div>
                <div class="flex gap-2">
                    <button
                        v-for="option in ['pending','in_review','approved','rejected']"
                        :key="option"
                        @click="changeStatus(option)"
                        class="px-3 py-1.5 rounded-lg text-sm font-medium border"
                        :class="filters.status === option
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'"
                    >
                        {{ option.replace('_', ' ') }}
                    </button>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead class="bg-gray-50 dark:bg-gray-900/70">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">Business</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">Owner</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">Status</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">Submitted</th>
                            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">Actions</th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        <tr v-for="req in requests.data" :key="req.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                            <td class="px-4 py-3">
                                <div class="font-semibold text-gray-900 dark:text-white">{{ req.business_name }}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">{{ req.user?.name }} ({{ req.user?.email }})</div>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                <div class="font-medium">{{ req.owner_name }}</div>
                                <div class="text-gray-500 dark:text-gray-400">{{ req.owner_email }}</div>
                            </td>
                            <td class="px-4 py-3">
                                <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="{
                                    'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200': req.status === 'pending' || req.status === 'in_review',
                                    'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200': req.status === 'approved',
                                    'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200': req.status === 'rejected',
                                }">
                                    {{ req.status.replace('_', ' ') }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                {{ req.submitted_at ? new Date(req.submitted_at).toLocaleString() : '—' }}
                            </td>
                            <td class="px-4 py-3 text-right">
                                <Link
                                    :href="`/admin/verification/${req.id}`"
                                    class="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                                >
                                    Review
                                </Link>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="requests.links?.length" class="px-4 py-3 flex flex-wrap gap-2 justify-center border-t border-gray-200 dark:border-gray-800">
                    <Link
                        v-for="link in requests.links"
                        :key="link.label"
                        :href="link.url || '#'"
                        v-html="link.label"
                        class="px-3 py-1.5 text-sm rounded-lg border"
                        :class="link.active
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
                    />
                </div>
            </div>
        </div>
    </AppLayout>
</template>
