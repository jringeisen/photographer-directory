<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import DarkModeToggle from '@/Components/DarkModeToggle.vue';
import { useDarkMode } from '@/composables/useDarkMode';

const page = usePage();
const { isDark, toggle } = useDarkMode();

const showNotifications = ref(false);
const notificationsPanel = ref(null);

const notifications = computed(() => page.props.notifications || { unread_count: 0, items: [] });

const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
};

const closeNotifications = () => {
    showNotifications.value = false;
};

const showUserMenu = ref(false);
const userMenuPanel = ref(null);

const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
    showUserMenu.value = false;
};

const handleClickOutside = (event) => {
    const clickedNotifications = notificationsPanel.value?.contains(event.target);
    const clickedUserMenu = userMenuPanel.value?.contains(event.target);

    if (!clickedNotifications) {
        closeNotifications();
    }

    if (!clickedUserMenu) {
        closeUserMenu();
    }
};

const markNotificationAsRead = (id = null) => {
    router.post('/notifications/mark-read', { notification_id: id }, {
        preserveScroll: true,
        onSuccess: () => {
            if (id === null) {
                closeNotifications();
            }
        },
    });
};

const formatDateTime = (value) => {
    if (!value) {
        return '';
    }

    return new Date(value).toLocaleString();
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <nav class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <Link href="/" class="text-xl font-bold text-gray-900 dark:text-white">
                            Photography Directory
                        </Link>
                    </div>
                    <div class="flex items-center space-x-4">
                        <DarkModeToggle :is-dark="isDark" @toggle="toggle" />

                        <template v-if="page.props.auth?.user">
                            <div class="relative" ref="notificationsPanel">
                                <button
                                    type="button"
                                    class="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    @click.stop="toggleNotifications"
                                    aria-label="Notifications"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span
                                        v-if="notifications.unread_count > 0"
                                        class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold leading-none rounded-full bg-primary-500 text-white"
                                    >
                                        {{ notifications.unread_count }}
                                    </span>
                                </button>

                                <div
                                    v-if="showNotifications"
                                    class="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-40"
                                >
                                    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <p class="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                {{ notifications.unread_count }} unread
                                            </p>
                                        </div>
                                        <button
                                            v-if="notifications.unread_count > 0"
                                            type="button"
                                            class="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                            @click.stop="markNotificationAsRead()"
                                        >
                                            Mark all read
                                        </button>
                                    </div>

                                    <div v-if="notifications.items.length === 0" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                                        No notifications yet.
                                    </div>

                                    <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
                                        <div
                                            v-for="item in notifications.items"
                                            :key="item.id"
                                            class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div class="flex items-start gap-3">
                                                <div class="mt-0.5">
                                                    <span
                                                        class="inline-flex h-2 w-2 rounded-full"
                                                        :class="item.read_at ? 'bg-gray-300 dark:bg-gray-500' : 'bg-primary-500'"
                                                    ></span>
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {{ item.data?.from_name || 'New message' }}
                                                    </p>
                                                    <p class="text-sm text-gray-600 dark:text-gray-300">
                                                        {{ item.data?.listing_name || 'Listing update' }}
                                                    </p>
                                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                        {{ item.data?.message }}
                                                    </p>
                                                    <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                                        {{ formatDateTime(item.created_at) }}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                                                    v-if="!item.read_at"
                                                    @click.stop="markNotificationAsRead(item.id)"
                                                >
                                                    Mark read
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-right">
                                        <Link
                                            href="/notifications"
                                            class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                            @click="closeNotifications"
                                        >
                                            View all
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div class="relative" ref="userMenuPanel">
                                <button
                                    type="button"
                                    class="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    @click.stop="toggleUserMenu"
                                >
                                    <span class="text-sm font-semibold truncate max-w-[140px]">{{ page.props.auth.user.name }}</span>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div
                                    v-if="showUserMenu"
                                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-40"
                                >
                                    <div class="py-1">
                                        <Link
                                            href="/dashboard"
                                            class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            @click="closeUserMenu"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            v-if="page.props.auth.user.is_admin"
                                            href="/admin/verification"
                                            class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            @click="closeUserMenu"
                                        >
                                            Verification
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            @click="closeUserMenu"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <Link href="/login" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
                            >
                                Register
                            </Link>
                        </template>
                    </div>
                </div>
            </div>
        </nav>

        <main>
            <slot />
        </main>
    </div>
</template>
