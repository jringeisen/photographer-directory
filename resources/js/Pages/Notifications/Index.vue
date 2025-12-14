<script setup>
import { ref } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import ConfirmDialog from '@/Components/ConfirmDialog.vue';

const props = defineProps({
    notifications: Object,
});

const selected = ref(null);
const pendingDelete = ref(null);

const open = (notification) => {
    selected.value = notification;
    if (!notification.read_at) {
        router.post('/notifications/mark-read', { notification_id: notification.id }, { preserveScroll: true });
    }
};

const close = () => {
    selected.value = null;
};

const destroyNotification = (notification) => {
    pendingDelete.value = notification;
};

const confirmDestroy = () => {
    if (!pendingDelete.value) {
        return;
    }

    const id = pendingDelete.value.id;

    router.delete(`/notifications/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
            if (selected.value?.id === id) {
                selected.value = null;
            }
        },
        onFinish: () => {
            pendingDelete.value = null;
        },
    });
};
</script>

<template>
    <AppLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400">View and manage your messages.</p>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead class="bg-gray-50 dark:bg-gray-900/70">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200">From</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200">Listing</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200">Message</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200">Date</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            <tr v-for="notification in notifications.data" :key="notification.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2">
                                        <span class="inline-flex h-2 w-2 rounded-full" :class="notification.read_at ? 'bg-gray-300 dark:bg-gray-500' : 'bg-primary-400'"></span>
                                        <div>
                                            <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                                {{ notification.data?.from_name || 'New message' }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                                {{ notification.data?.from_email || '—' }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                    <Link
                                        v-if="notification.listing?.id"
                                        :href="`/listings/${notification.listing.id}`"
                                        class="text-primary-600 dark:text-primary-400 hover:underline"
                                    >
                                        {{ notification.listing.name }}
                                    </Link>
                                    <span v-else class="text-gray-500 dark:text-gray-400">—</span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                                    {{ notification.data?.message_preview || notification.data?.message || '—' }}
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                    {{ new Date(notification.created_at).toLocaleString() }}
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button
                                            class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                                            @click="open(notification)"
                                        >
                                            View
                                        </button>
                                        <button
                                            class="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
                                            @click="destroyNotification(notification)"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="notifications.links?.length" class="mt-6 flex flex-wrap gap-2 justify-center">
                    <Link
                        v-for="link in notifications.links"
                        :key="link.label"
                        :href="link.url || '#'"
                        preserve-scroll
                        v-html="link.label"
                        :class="[
                            'px-3 py-2 text-sm rounded-lg border',
                            link.active
                                ? 'bg-primary-500 text-white border-primary-500'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        ]"
                    />
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div v-if="selected" class="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>
                <div class="relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">From {{ selected.data?.from_name || 'New message' }}</p>
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Message details</h3>
                        </div>
                        <button
                            type="button"
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            @click="close"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="mt-4 space-y-3">
                        <div class="text-sm text-gray-600 dark:text-gray-300">
                            <div><span class="font-semibold">Email:</span> {{ selected.data?.from_email || '—' }}</div>
                            <div><span class="font-semibold">Phone:</span> {{ selected.data?.phone || '—' }}</div>
                            <div><span class="font-semibold">Listing:</span>
                                <Link
                                    v-if="selected.listing?.id"
                                    :href="`/listings/${selected.listing.id}`"
                                    class="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    {{ selected.listing.name }}
                                </Link>
                                <span v-else>—</span>
                            </div>
                            <div><span class="font-semibold">Received:</span> {{ new Date(selected.created_at).toLocaleString() }}</div>
                        </div>
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                            {{ selected.message_full || selected.data?.message || selected.data?.message_preview || 'No message provided.' }}
                        </div>
                    </div>

                    <div class="mt-6 flex items-center justify-end gap-3">
                        <button
                            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            @click="close"
                        >
                            Close
                        </button>
                        <button
                            class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
                            @click="destroyNotification(selected)"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <ConfirmDialog
            :show="!!pendingDelete"
            title="Delete notification?"
            :message="pendingDelete ? 'This will remove the notification permanently.' : ''"
            confirm-text="Delete"
            cancel-text="Cancel"
            @update:show="pendingDelete = null"
            @confirm="confirmDestroy"
        />
    </AppLayout>
</template>
