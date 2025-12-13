<script setup>
import { Link, usePage } from '@inertiajs/vue3';
import DarkModeToggle from '@/Components/DarkModeToggle.vue';
import { useDarkMode } from '@/composables/useDarkMode';

const page = usePage();
const { isDark, toggle } = useDarkMode();
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
                            <Link
                                href="/dashboard"
                                class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Dashboard
                            </Link>
                            <span class="text-gray-700 dark:text-gray-300">{{ page.props.auth.user.name }}</span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Logout
                            </Link>
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
