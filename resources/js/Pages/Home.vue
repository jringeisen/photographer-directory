<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import SearchFilters from '@/Components/SearchFilters.vue';
import StatsBar from '@/Components/StatsBar.vue';
import ListingCard from '@/Components/ListingCard.vue';

defineProps({
    listings: Object,
    photographyTypes: Array,
    locations: Array,
    stats: Object,
    filters: Object,
});
</script>

<template>
    <Head>
        <title>Photography Directory - Find Professional Photographers</title>
        <meta name="description" content="Browse and connect with professional photographers. Find wedding, portrait, event, and commercial photographers near you." />
        <meta property="og:title" content="Photography Directory - Find Professional Photographers" />
        <meta property="og:description" content="Browse and connect with professional photographers. Find wedding, portrait, event, and commercial photographers near you." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Photography Directory" />
        <meta name="twitter:description" content="Find professional photographers for your next project." />
    </Head>
    <AppLayout>
        <!-- Hero Section -->
        <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-20">
                <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 40px 40px;"></div>
            </div>

            <!-- Gradient Orbs -->
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div class="text-center">
                    <!-- Badge -->
                    <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-8">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Find Your Perfect Photographer
                    </span>

                    <!-- Headline -->
                    <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Discover Talented
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-400">
                            Photographers
                        </span>
                    </h1>

                    <!-- Subheadline -->
                    <p class="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Browse portfolios, compare styles, and connect with professional photographers for your next project.
                    </p>

                    <!-- Search -->
                    <SearchFilters
                        :photography-types="photographyTypes"
                        :locations="locations"
                        :filters="filters"
                    />

                    <!-- Stats -->
                    <div class="mt-16 pt-8 border-t border-white/10">
                        <p class="text-sm text-gray-500 mb-6">Trusted by clients worldwide</p>
                        <StatsBar :stats="stats" />
                    </div>
                </div>
            </div>

            <!-- Wave Divider -->
            <div class="absolute bottom-0 left-0 right-0">
                <svg class="w-full h-16 md:h-24 text-gray-50 dark:text-gray-900" viewBox="0 0 1440 74" fill="currentColor" preserveAspectRatio="none">
                    <path d="M0,74 L1440,74 L1440,0 C1200,50 960,74 720,74 C480,74 240,50 0,0 L0,74 Z"></path>
                </svg>
            </div>
        </section>

        <!-- Listings Section -->
        <section class="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Section Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Featured Photographers
                        </h2>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">
                            {{ listings?.total || 0 }} photographers found
                        </p>
                    </div>
                </div>

                <!-- Listings Grid -->
                <div
                    v-if="listings?.data?.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <ListingCard
                        v-for="listing in listings.data"
                        :key="listing.id"
                        :listing="listing"
                    />
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-20">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                        <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No photographers found</h3>
                    <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Try adjusting your search or filter criteria to find what you're looking for.
                    </p>
                </div>

                <!-- Pagination -->
                <div v-if="listings?.last_page > 1" class="mt-12 flex flex-wrap justify-center gap-2">
                    <template v-for="link in listings.links" :key="link.label">
                        <Link
                            v-if="link.url"
                            :href="link.url"
                            :class="[
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                link.active
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            ]"
                            v-html="link.label"
                            preserve-scroll
                        />
                        <span
                            v-else
                            :class="[
                                'px-4 py-2 rounded-lg text-sm font-medium',
                                'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            ]"
                            v-html="link.label"
                        />
                    </template>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="relative py-20 overflow-hidden">
            <!-- Background -->
            <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500"></div>
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 30px 30px;"></div>
            </div>

            <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
                    Are You a Photographer?
                </h2>
                <p class="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                    Join our directory and showcase your work to thousands of potential clients looking for talented photographers like you.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/register"
                        class="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg shadow-black/10"
                    >
                        Create Your Listing
                        <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <Link
                        href="/login"
                        class="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 dark:bg-black py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div class="text-gray-400 text-sm">
                        &copy; {{ new Date().getFullYear() }} Photography Directory. All rights reserved.
                    </div>
                    <div class="flex items-center gap-6 text-sm">
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy</a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms</a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    </AppLayout>
</template>
