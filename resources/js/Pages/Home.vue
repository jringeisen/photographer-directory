<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import SearchFilters from '@/Components/SearchFilters.vue';
import ListingCard from '@/Components/ListingCard.vue';

defineProps({
    listings: Object,
    stats: Object,
    filters: Object,
    curatedListings: Array,
    curatedCity: String,
});

const locating = ref(false);
const locationError = ref('');

const geolocate = async () => {
    locationError.value = '';

    if (!('geolocation' in navigator)) {
        locationError.value = 'Location is not supported in this browser.';
        return;
    }

    locating.value = true;
    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, {
                    headers: {
                        'Accept-Language': 'en',
                    },
                });

                if (!resp.ok) {
                    throw new Error('Unable to detect city.');
                }

                const data = await resp.json();
                const address = data.address || {};
                const city = address.city || address.town || address.village || address.county || null;
                const state = address.state || address.region || null;
                const stateCode = address.state_code || null;

                const cityLabel = city && (stateCode || state)
                    ? `${city}, ${stateCode || state}`
                    : city || stateCode || state;

                if (!cityLabel) {
                    throw new Error('Could not determine your city.');
                }

                router.visit('/', {
                    data: { curated_city: cityLabel, curated_state: stateCode || state },
                    only: ['curatedListings', 'curatedCity'],
                    preserveScroll: true,
                    replace: true,
                });
            } catch (error) {
                locationError.value = error.message || 'Unable to detect city.';
            } finally {
                locating.value = false;
            }
        },
        (err) => {
            locating.value = false;
            if (err.code === err.PERMISSION_DENIED) {
                locationError.value = 'Permission denied. Please allow location access to show nearby picks.';
            } else {
                locationError.value = 'Unable to detect city.';
            }
        },
        { timeout: 8000, maximumAge: 0 }
    );
};
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
                            Verified photographers
                        </div>
                        <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                            Find the right photographer,
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-cyan-200 to-primary-300">faster.</span>
                        </h1>
                        <p class="text-lg sm:text-xl text-slate-200/90 max-w-2xl">
                            Natural-language search understands what you need—try “wedding photographers in Panama City, FL” and jump straight to the best matches.
                        </p>

                        <div class="space-y-3">
                            <SearchFilters :filters="filters" />
                            <div class="flex items-center gap-3 text-sm text-slate-200/90">
                                <button
                                    type="button"
                                    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/15 transition-colors disabled:opacity-60"
                                    @click="geolocate"
                                    :disabled="locating"
                                >
                                    <svg
                                        class="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21l-8-8 8-8 8 8-8 8z" />
                                    </svg>
                                    <span v-if="!locating">Use my location for curated picks</span>
                                    <span v-else>Detecting…</span>
                                </button>
                                <span v-if="locationError" class="text-amber-200">{{ locationError }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-5">
                        <div class="relative bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/30 backdrop-blur">
                            <div class="flex items-center justify-between mb-4">
                                <div class="text-white">
                                    <p class="text-sm text-slate-300">
                                        Top matches near
                                        <span class="font-semibold text-white">
                                            {{ curatedCity || curatedListings?.[0]?.city || 'your area' }}
                                        </span>
                                    </p>
                                    <p class="text-xl font-semibold">Curated portfolio tiles</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <Link
                                    v-for="listing in curatedListings"
                                    :key="listing.id"
                                    :href="`/listings/${listing.id}`"
                                    class="group relative rounded-xl overflow-hidden bg-white/10 border border-white/10 h-32"
                                >
                                    <img
                                        v-if="listing.images?.[0]?.url"
                                        :src="listing.images[0].url"
                                        :alt="listing.company_name"
                                        class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div v-else class="h-full w-full bg-gradient-to-br from-slate-100/10 to-white/10 dark:from-slate-800/60 dark:to-slate-700/60" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                    <div class="absolute bottom-2 left-2 right-2 text-white">
                                        <p class="text-sm font-semibold truncate">{{ listing.company_name }}</p>
                                        <p class="text-xs text-white/80 truncate">{{ listing.city }}, {{ listing.state }}</p>
                                    </div>
                                </Link>
                                <div v-if="!curatedListings?.length" class="rounded-xl overflow-hidden bg-white/10 h-32 border border-white/10 flex items-center justify-center text-white/70 text-sm col-span-2">
                                    No nearby picks yet—browse all below.
                                </div>
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
                            {{ listings?.total || 0 }} photographers match your search.
                        </p>
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
                        Try a broader phrase, different city/state wording, or remove niche keywords to see more results.
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

        <!-- Verification Quality Section -->
        <section class="py-16 md:py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <p class="text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">Quality control</p>
                    <h2 class="text-3xl font-bold text-slate-900 dark:text-white mt-2">Verified listings you can trust.</h2>
                    <p class="mt-3 text-slate-600 dark:text-slate-300">
                        We manually review every verification request to keep the directory reputable and authentic.
                        Verified businesses get a badge on their listings, and rejected accounts are hidden until resolved.
                    </p>
                    <div class="mt-6 space-y-3 text-slate-700 dark:text-slate-200">
                        <div class="flex items-start gap-3">
                            <span class="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                            Business registration check for the claimed state.
                        </div>
                        <div class="flex items-start gap-3">
                            <span class="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                            BBB standing review to screen for issues.
                        </div>
                        <div class="flex items-start gap-3">
                            <span class="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                            In-platform contact so conversations stay on record.
                        </div>
                    </div>
                    <div class="mt-6 flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/verification"
                            class="inline-flex items-center px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700"
                        >
                            Submit verification
                        </Link>
                        <Link
                            href="/"
                            class="inline-flex items-center px-5 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            Browse verified listings
                        </Link>
                    </div>
                </div>
                <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl">
                    <div class="text-white font-semibold text-lg mb-4">How verification works</div>
                    <div class="space-y-4">
                        <div class="flex items-start gap-3">
                            <div class="h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-center font-bold">1</div>
                            <div>
                                <p class="text-white font-semibold">Submit your business</p>
                                <p class="text-slate-300 text-sm">Share your business name, owner details, and registration info.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-center font-bold">2</div>
                            <div>
                                <p class="text-white font-semibold">We review & verify</p>
                                <p class="text-slate-300 text-sm">We check registration and BBB standing. If rejected, we share notes.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-center font-bold">3</div>
                            <div>
                                <p class="text-white font-semibold">Badge on your listings</p>
                                <p class="text-slate-300 text-sm">Approved accounts get a verified badge, boosting trust with clients.</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200">
                        Rejected accounts are hidden until they’re re-approved, keeping search results clean and trustworthy.
                    </div>
                </div>
            </div>
        </section>

        <!-- Analytics Section -->
        <section class="py-14 md:py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
                <div class="relative">
                    <div class="absolute -inset-4 bg-gradient-to-br from-primary-500/10 via-cyan-500/10 to-primary-500/10 blur-3xl rounded-3xl"></div>
                    <div class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-black/10 p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500 dark:text-slate-400">This week</p>
                                <p class="text-2xl font-bold text-slate-900 dark:text-white">Engagement snapshot</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <p class="text-xs text-slate-500 dark:text-slate-400">Profile views</p>
                                <p class="text-xl font-semibold text-slate-900 dark:text-white mt-1">248</p>
                                <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+18% vs last week</p>
                            </div>
                            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <p class="text-xs text-slate-500 dark:text-slate-400">Contacts</p>
                                <p class="text-xl font-semibold text-slate-900 dark:text-white mt-1">14</p>
                                <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+9% vs last week</p>
                            </div>
                            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <p class="text-xs text-slate-500 dark:text-slate-400">Portfolio views</p>
                                <p class="text-xl font-semibold text-slate-900 dark:text-white mt-1">132</p>
                                <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+22% vs last week</p>
                            </div>
                            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <p class="text-xs text-slate-500 dark:text-slate-400">Top city</p>
                                <p class="text-xl font-semibold text-slate-900 dark:text-white mt-1">Austin, TX</p>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">33 views this week</p>
                            </div>
                        </div>
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                            Get weekly summaries in your inbox and drill down anytime from your dashboard.
                        </p>
                    </div>
                </div>
                <div class="space-y-4">
                    <p class="text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">Analytics</p>
                    <h2 class="text-3xl font-bold text-slate-900 dark:text-white">See what’s working.</h2>
                    <p class="text-slate-600 dark:text-slate-300">
                        FocusFolio tracks the metrics that matter so you know where to invest: views, contacts, portfolio impressions, and which cities are finding you.
                    </p>
                    <div class="grid sm:grid-cols-2 gap-3">
                        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">Profile views</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">See spikes after edits or promos.</p>
                        </div>
                        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">Contacts & replies</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Track inquiries and follow-ups.</p>
                        </div>
                        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">Portfolio views</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Know which sets resonate.</p>
                        </div>
                        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">Top locations</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">See which cities discover you most.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="relative py-16 md:py-20 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-600 to-cyan-600"></div>
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
                        <p class="text-sm font-semibold text-primary-600">Why photographers choose us</p>
                        <ul class="mt-4 space-y-3 text-slate-700">
                            <li class="flex items-start gap-2">
                                <span class="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                Verified badges to build trust and rank higher in local results.
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                In-app messaging that emails you instantly—no lost leads.
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                Curated nearby placement so clients see you first in their city/state.
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                Portfolio + gallery support with on-site lightbox and ordering.
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
