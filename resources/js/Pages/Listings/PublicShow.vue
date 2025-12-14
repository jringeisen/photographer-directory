<script setup>
import { ref, computed } from 'vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';

const props = defineProps({
    listing: Object,
});

const page = usePage();
const appUrl = computed(() => page.props.appUrl);
const flash = computed(() => page.props.flash || {});

const metaDescription = computed(() => {
    if (props.listing.description) {
        // Strip HTML tags and truncate to 160 chars
        const stripped = props.listing.description.replace(/<[^>]*>/g, '');
        return stripped.length > 160 ? stripped.substring(0, 157) + '...' : stripped;
    }
    return `${props.listing.company_name} - Professional photographer in ${props.listing.city}, ${props.listing.state}`;
});

const ogImage = computed(() => props.listing.images?.[0]?.url || null);

const canonicalUrl = computed(() => `${appUrl.value}/listings/${props.listing.id}`);

// Lightbox state
const selectedImage = ref(null);
const showContact = ref(false);
const form = useForm({
    name: page.props.auth?.user?.name ?? '',
    email: page.props.auth?.user?.email ?? '',
    phone: '',
    message: '',
});

const openLightbox = (image) => {
    selectedImage.value = image;
};

const closeLightbox = () => {
    selectedImage.value = null;
};

const openContact = () => {
    showContact.value = true;
};

const closeContact = () => {
    showContact.value = false;
};

const submitContact = () => {
    form.post(`/listings/${props.listing.id}/contact`, {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            closeContact();
        },
    });
};
</script>

<template>
    <Head>
        <title>{{ listing.company_name }} | Photography Directory</title>
        <meta name="description" :content="metaDescription" />
        <meta property="og:title" :content="listing.company_name" />
        <meta property="og:description" :content="metaDescription" />
        <meta property="og:image" :content="ogImage" v-if="ogImage" />
        <meta property="og:type" content="website" />
        <meta property="og:url" :content="canonicalUrl" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" :content="listing.company_name" />
        <meta name="twitter:description" :content="metaDescription" />
        <meta name="twitter:image" :content="ogImage" v-if="ogImage" />
        <link rel="canonical" :href="canonicalUrl" />
    </Head>
    <AppLayout>
        <!-- Hero Section -->
        <section class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black overflow-hidden">
            <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0); background-size: 34px 34px;"></div>
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-20 md:pb-28">
                <div class="flex items-center justify-between text-white/70 text-sm mb-6">
                    <Link
                        href="/"
                        class="inline-flex items-center hover:text-white transition-colors"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to browse
                    </Link>
                    <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs">
                        Verified listing
                        <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                    </span>
                </div>

                <div class="grid md:grid-cols-3 gap-8 items-start">
                    <div class="md:col-span-2 space-y-4">
                        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight">
                            {{ listing.company_name }}
                        </h1>
                        <div class="flex flex-wrap items-center gap-3 text-slate-200/90">
                            <span
                                v-if="listing.user?.verification_status === 'verified'"
                                class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 text-sm"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Verified business
                            </span>
                            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">
                                <svg class="w-4 h-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {{ listing.city }}, {{ listing.state }}
                            </span>
                            <span
                                v-for="type in listing.photography_types"
                                :key="type.id"
                                class="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/15 border border-primary-400/30 text-primary-200 text-sm"
                            >
                                {{ type.name }}
                            </span>
                        </div>
                        <div class="grid grid-cols-3 gap-4 text-white/90">
                            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                                <p class="text-xs text-white/60 uppercase tracking-[0.15em]">Portfolios</p>
                                <p class="text-xl font-semibold mt-1">{{ listing.portfolios?.length || 0 }}</p>
                            </div>
                            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                                <p class="text-xs text-white/60 uppercase tracking-[0.15em]">Images</p>
                                <p class="text-xl font-semibold mt-1">{{ listing.images?.length || 0 }}</p>
                            </div>
                            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                                <p class="text-xs text-white/60 uppercase tracking-[0.15em]">Response</p>
                                <p class="text-xl font-semibold mt-1">Typically <span class="text-emerald-300">fast</span></p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-2xl shadow-black/20 border border-white/30 p-5 space-y-4">
                        <div>
                            <p class="text-sm text-slate-500">Contact {{ listing.company_name }}</p>
                            <p class="text-lg font-semibold text-slate-900">In-platform messaging</p>
                        </div>
                        <div class="space-y-3 text-slate-700">
                            <div v-if="listing.email" class="flex items-center gap-2">
                                <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-slate-500">Email</p>
                                    <p class="font-medium text-slate-900 truncate">{{ listing.email }}</p>
                                </div>
                            </div>
                            <div v-if="listing.phone" class="flex items-center gap-2">
                                <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-slate-500">Phone</p>
                                    <p class="font-medium text-slate-900 truncate">{{ listing.phone }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-500">Location</p>
                                    <p class="font-medium text-slate-900">{{ listing.city }}, {{ listing.state }}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="w-full inline-flex items-center justify-center px-5 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
                            @click="openContact"
                        >
                            Get in Touch
                        </button>
                        <p
                            v-if="flash?.success"
                            class="text-sm text-emerald-600"
                        >
                            {{ flash.success }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-14 md:py-18 bg-slate-50 dark:bg-slate-900">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
                    <div class="lg:col-span-2 space-y-10">
                        <div v-if="listing.description" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">About</h2>
                            <div
                                class="prose prose-sm max-w-none text-slate-700 dark:text-slate-200 dark:prose-invert prose-p:leading-relaxed"
                                v-html="listing.description"
                            ></div>
                        </div>

                        <div v-if="listing.images?.length > 0" class="space-y-4">
                            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Gallery</h2>
                            <div class="grid sm:grid-cols-2 gap-3">
                                <div
                                    v-for="image in listing.images"
                                    :key="image.id"
                                    class="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm cursor-pointer group"
                                    @click="openLightbox(image)"
                                >
                                    <img
                                        :src="image.url"
                                        :alt="image.filename"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-8">
                        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Highlights</h3>
                            <ul class="mt-4 space-y-3 text-slate-700 dark:text-slate-200">
                                <li class="flex items-start gap-2">
                                    <span class="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                    Direct-to-cloud uploads with in-app messaging
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                    {{ listing.photography_types?.length || 0 }} styles available for booking
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                    Portfolio-first layout inspired by modern property sites
                                </li>
                            </ul>
                        </div>

                        <div v-if="listing.portfolios?.length > 0" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Portfolios</h3>
                            <div class="space-y-4">
                                <div
                                    v-for="portfolio in listing.portfolios"
                                    :key="portfolio.id"
                                    class="flex items-center gap-4"
                                >
                                    <div class="w-24 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                                        <img
                                            v-if="portfolio.images?.[0]"
                                            :src="portfolio.images[0].url"
                                            :alt="portfolio.name"
                                            class="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p class="font-medium text-slate-900 dark:text-white">{{ portfolio.name }}</p>
                                        <p class="text-sm text-slate-500 dark:text-slate-400">{{ portfolio.images?.length || 0 }} images</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="relative py-20 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500"></div>
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 30px 30px;"></div>
            </div>

            <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
                    Are You a Photographer?
                </h2>
                <p class="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                    Join our directory and showcase your work to thousands of potential clients.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/register"
                        class="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all"
                    >
                        Create Your Listing
                    </Link>
                    <Link
                        href="/"
                        class="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                    >
                        Browse More
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

        <!-- Contact Modal -->
        <Teleport to="body">
            <div
                v-if="showContact"
                class="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeContact"></div>

                <div class="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                {{ listing.company_name }}
                            </h3>
                        </div>
                        <button
                            type="button"
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            @click="closeContact"
                            aria-label="Close contact modal"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form class="mt-4 space-y-4" @submit.prevent="submitContact">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your name</label>
                            <input
                                v-model="form.name"
                                type="text"
                                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                            <p v-if="form.errors.name" class="text-sm text-red-500 mt-1">{{ form.errors.name }}</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input
                                    v-model="form.email"
                                    type="email"
                                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                                <p v-if="form.errors.email" class="text-sm text-red-500 mt-1">{{ form.errors.email }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (optional)</label>
                                <input
                                    v-model="form.phone"
                                    type="text"
                                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                                <p v-if="form.errors.phone" class="text-sm text-red-500 mt-1">{{ form.errors.phone }}</p>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                            <textarea
                                v-model="form.message"
                                rows="4"
                                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            ></textarea>
                            <p v-if="form.errors.message" class="text-sm text-red-500 mt-1">{{ form.errors.message }}</p>
                        </div>

                        <div class="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                @click="closeContact"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="inline-flex items-center px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-60"
                                :disabled="form.processing"
                            >
                                <svg
                                    v-if="form.processing"
                                    class="animate-spin h-4 w-4 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Lightbox -->
        <Teleport to="body">
            <div
                v-if="selectedImage"
                class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                @click="closeLightbox"
            >
                <button
                    class="absolute top-6 right-6 text-white/70 hover:text-white text-4xl"
                    @click="closeLightbox"
                >
                    &times;
                </button>
                <img
                    :src="selectedImage.url"
                    class="max-h-[90vh] max-w-[90vw] object-contain"
                    @click.stop
                />
            </div>
        </Teleport>
    </AppLayout>
</template>
