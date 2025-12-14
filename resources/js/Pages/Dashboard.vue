<script setup>
import { ref, watch } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import EmptyState from '@/Components/EmptyState.vue';
import ConfirmDialog from '@/Components/ConfirmDialog.vue';

const props = defineProps({
    listings: Array,
    filters: Object,
    analytics: Object,
});

const page = usePage();
const search = ref(props.filters?.search || '');

let searchTimeout = null;

watch(search, (value) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        router.get('/dashboard', { search: value || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, 300);
});

const pendingDelete = ref(null);

const promptDelete = (listing) => {
    pendingDelete.value = listing;
};

const deleteListing = () => {
    if (!pendingDelete.value) {
        return;
    }

    router.delete(`/listings/${pendingDelete.value.id}`, {
        onFinish: () => {
            pendingDelete.value = null;
        },
    });
};
</script>

<template>
    <AppLayout>
        <div class="max-w-7xl mx-auto transition-colors px-4 sm:px-6 lg:px-0">
            <div class="mt-8">
                <div
                    v-if="page.props.auth?.user && page.props.auth.user.verification_status !== 'verified'"
                    class="mb-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-100 px-4 py-3 flex items-center justify-between gap-3"
                >
                    <div>
                        <p class="font-semibold text-sm">Get verified to add trust badges to your listings.</p>
                        <p class="text-sm text-amber-700/80 dark:text-amber-100/80">Submit your business details for review.</p>
                    </div>
                    <Link
                        href="/verification"
                        class="px-3 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700"
                    >
                        Submit verification
                    </Link>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Listing views</p>
                    <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-1">{{ analytics?.total_views || 0 }}</p>
                </div>
                <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Contacts received</p>
                    <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-1">{{ analytics?.total_contacts || 0 }}</p>
                </div>
                <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Portfolio views</p>
                    <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-1">{{ analytics?.total_portfolio_views || 0 }}</p>
                </div>
                <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm flex flex-col justify-between">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Top listing</p>
                        <p class="text-base font-semibold text-gray-900 dark:text-white mt-1">
                            {{ analytics?.top_listing?.company_name || '—' }}
                        </p>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {{ analytics?.top_listing ? `${analytics.top_listing.views_count} views` : 'No data yet' }}
                    </p>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Listings</h1>
                    <Link
                        href="/listings/create"
                        class="inline-flex items-center justify-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Listing
                    </Link>
                </div>

                <!-- Search -->
                <div v-if="listings.length > 0 || search" class="mb-6">
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            v-model="search"
                            type="text"
                            placeholder="Search listings..."
                            class="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                        />
                    </div>
                </div>

                <!-- Empty State -->
                <EmptyState
                    v-if="listings.length === 0 && !search"
                    title="No listings yet"
                    description="Create your first photography listing to start showcasing your work."
                    button-text="Create Your First Listing"
                    button-href="/listings/create"
                />

                <!-- No Results State -->
                <div v-else-if="listings.length === 0 && search" class="text-center py-12">
                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p class="text-gray-500 dark:text-gray-400">No listings found matching "{{ search }}"</p>
                </div>

                <!-- Table -->
                <div v-else class="overflow-x-auto">
                    <table class="w-full border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                        <thead class="bg-gray-100 dark:bg-gray-800/70">
                        <tr class="border-b border-gray-200 dark:border-gray-800">
                            <th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Company Name</th>
                            <th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Location</th>
                            <th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Types</th>
                            <th class="text-center py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Images</th>
                            <th class="text-center py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Portfolios</th>
                            <th class="text-center py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Views</th>
                            <th class="text-center py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Contacts</th>
                            <th class="text-right py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100">Actions</th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        <tr
                            v-for="listing in listings"
                            :key="listing.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                        >
                            <!-- Company Name -->
                            <td class="py-4 px-4">
                                <Link
                                    :href="`/listings/${listing.id}`"
                                    class="font-medium text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                                >
                                    {{ listing.company_name }}
                                </Link>
                                <span
                                    v-if="page.props.auth?.user?.verification_status === 'verified'"
                                    class="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200"
                                >
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Verified
                                </span>
                            </td>

                            <!-- Location -->
                            <td class="py-4 px-4 text-gray-600 dark:text-gray-300">
                                {{ listing.city }}, {{ listing.state }}
                            </td>

                            <!-- Types -->
                            <td class="py-4 px-4">
                                <div class="flex flex-wrap gap-1">
                                    <span
                                        v-for="type in listing.photography_types.slice(0, 2)"
                                        :key="type.id"
                                        class="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                    >
                                        {{ type.name }}
                                    </span>
                                    <span
                                        v-if="listing.photography_types.length > 2"
                                        class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                    >
                                        +{{ listing.photography_types.length - 2 }}
                                    </span>
                                </div>
                            </td>

                            <!-- Images Count -->
                            <td class="py-4 px-4 text-center text-gray-600 dark:text-gray-300">
                                {{ listing.images_count }}
                            </td>

                            <!-- Portfolios Count -->
                            <td class="py-4 px-4 text-center text-gray-600 dark:text-gray-300">
                                {{ listing.portfolios_count }}
                            </td>

                            <!-- Views -->
                            <td class="py-4 px-4 text-center text-gray-600 dark:text-gray-300">
                                {{ listing.views_count || 0 }}
                            </td>

                            <!-- Contacts -->
                            <td class="py-4 px-4 text-center text-gray-600 dark:text-gray-300">
                                {{ listing.contacts_count || 0 }}
                            </td>

                            <!-- Actions -->
                            <td class="py-4 px-4">
                                <div class="flex items-center justify-end gap-2">
                                    <Link
                                        :href="`/listings/${listing.id}/portfolios`"
                                        class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Portfolios
                                    </Link>
                                    <Link
                                        :href="`/listings/${listing.id}/edit`"
                                        class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        @click="promptDelete(listing)"
                                        class="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <ConfirmDialog
            :show="!!pendingDelete"
            title="Delete listing?"
            :message="pendingDelete ? `Deleting ${pendingDelete.company_name} will remove portfolios and images. This cannot be undone.` : ''"
            confirm-text="Delete"
            cancel-text="Cancel"
            @update:show="pendingDelete = null"
            @confirm="deleteListing"
        />
    </AppLayout>
</template>
