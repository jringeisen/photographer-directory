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
        <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black">
            <div class="absolute inset-0 pointer-events-none">
                <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0); background-size: 36px 36px;"></div>
                <div class="absolute -left-20 top-10 w-80 h-80 bg-primary-500/30 blur-3xl rounded-full"></div>
                <div class="absolute -right-10 bottom-10 w-96 h-96 bg-cyan-400/25 blur-3xl rounded-full"></div>
            </div>

            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div class="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    <div class="lg:col-span-7 space-y-6">
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-primary-200 border border-white/15 backdrop-blur">
                            <span class="inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                            Verified photographers, curated styles
                        </div>
                        <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                            Find the right photographer,
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-cyan-200 to-primary-300">faster.</span>
                        </h1>
                        <p class="text-lg sm:text-xl text-slate-200/90 max-w-2xl">
                            Explore portfolios with Zillow-like clarity—filter by location, style, and vibe, then contact the pro without leaving the site.
                        </p>

                        <div class="p-4 md:p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-lg shadow-black/10">
                            <SearchFilters
                                :photography-types="photographyTypes"
                                :locations="locations"
                                :filters="filters"
                            />
                            <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-200/80">
                                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                    <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                                    Instant contact with secure messaging
                                </div>
                                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                    <span class="h-2 w-2 rounded-full bg-cyan-300"></span>
                                    Curated photography styles
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-white">
                                <p class="text-sm text-slate-300">Active photographers</p>
                                <p class="text-2xl font-semibold mt-1">{{ stats?.totalPhotographers || 0 }}</p>
                            </div>
                            <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-white">
                                <p class="text-sm text-slate-300">Portfolios showcased</p>
                                <p class="text-2xl font-semibold mt-1">{{ stats?.totalPortfolios || 0 }}</p>
                            </div>
                            <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-white">
                                <p class="text-sm text-slate-300">Images uploaded</p>
                                <p class="text-2xl font-semibold mt-1">{{ stats?.totalImages || 0 }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-5">
                        <div class="relative bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/30 backdrop-blur">
                            <div class="flex items-center justify-between mb-4">
                                <div class="text-white">
                                    <p class="text-sm text-slate-300">Top matches near you</p>
                                    <p class="text-xl font-semibold">Curated portfolio tiles</p>
                                </div>
                                <span class="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white">Live</span>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div v-for="n in 4" :key="n" class="rounded-xl overflow-hidden bg-white/10 h-32 border border-white/10">
                                    <div class="h-full w-full bg-gradient-to-br from-slate-100/10 to-white/10 dark:from-slate-800/60 dark:to-slate-700/60"></div>
                                </div>
                            </div>
                            <div class="mt-4 text-sm text-slate-200/90">
                                Modern, map-ready layout with clean labels inspired by Zillow’s browsing experience.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Listings Section -->
        <section class="py-12 md:py-18 bg-slate-50 dark:bg-slate-900">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    <div>
                        <p class="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Browse</p>
                        <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Featured Photographers</h2>
                        <p class="text-slate-600 dark:text-slate-400 mt-1">
                            {{ listings?.total || 0 }} photographers match your filters.
                        </p>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span class="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        Real-time availability and fresh uploads.
                    </div>
                </div>

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

                <div v-else class="text-center py-20">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                        <svg class="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">No photographers found</h3>
                    <p class="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Adjust filters to expand your search radius or explore nearby states.
                    </p>
                </div>

                <div v-if="listings?.last_page > 1" class="mt-10 flex flex-wrap justify-center gap-2">
                    <template v-for="link in listings.links" :key="link.label">
                        <Link
                            v-if="link.url"
                            :href="link.url"
                            :class="[
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                link.active
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            ]"
                            v-html="link.label"
                            preserve-scroll
                        />
                        <span
                            v-else
                            :class="[
                                'px-4 py-2 rounded-lg text-sm font-medium',
                                'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            ]"
                            v-html="link.label"
                        />
                    </template>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="relative py-16 md:py-20 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500"></div>
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 30px 30px;"></div>
            </div>

            <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="md:col-span-2 bg-white/10 border border-white/20 rounded-2xl p-8 text-white shadow-2xl shadow-black/20">
                        <p class="text-sm uppercase tracking-[0.2em] text-white/70 mb-2">Showcase</p>
                        <h2 class="text-3xl md:text-4xl font-bold mb-4">Join the directory and book more shoots.</h2>
                        <p class="text-white/80 max-w-2xl">
                            Publish your listing, upload a gallery, and respond to inquiries directly inside the platform—no more mailto links.
                        </p>
                        <div class="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/register"
                                class="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg shadow-black/10"
                            >
                                Create Your Listing
                            </Link>
                            <Link
                                href="/login"
                                class="inline-flex items-center justify-center px-6 py-3 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition-all duration-200 border border-white/25"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                    <div class="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl shadow-black/10 border border-white/60">
                        <p class="text-sm font-semibold text-primary-600">Why creators choose us</p>
                        <ul class="mt-4 space-y-3 text-slate-700">
                            <li class="flex items-start gap-2">
                                <span class="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                Zillow-inspired browse experience with clean filters.
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                Secure, in-app contact with database + email notifications.
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                Polished Tailwind 4 UI ready for dark mode.
                            </li>
                        </ul>
                    </div>
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
                        <Link href="/privacy" class="text-gray-400 hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" class="text-gray-400 hover:text-white transition-colors">Terms</Link>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    </AppLayout>
</template>
