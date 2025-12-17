<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';

const props = defineProps({
    listing: Object,
    canBypassHidden: Boolean,
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

const ogImage = computed(() => props.listing.images?.[0]?.url);

const canonicalUrl = computed(() => `${appUrl.value}/listings/${props.listing.id}`);

const structuredDataJson = computed(() => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': canonicalUrl.value,
    name: props.listing.company_name,
    url: canonicalUrl.value,
    image: ogImage.value,
    address: {
        addressLocality: props.listing.city,
        addressRegion: props.listing.state,
        addressCountry: 'US',
    },
    telephone: props.listing.phone || undefined,
    email: props.listing.email || undefined,
    areaServed: props.listing.state,
    sameAs: [],
    knowsAbout: props.listing.photography_types?.map((type) => type.name) || [],
}));

const jsonLdElementId = `listing-json-ld-${props.listing.id}`;

const syncJsonLd = (payload) => {
    if (typeof document === 'undefined') {
        return;
    }

    const existing = document.getElementById(jsonLdElementId);
    if (existing) {
        existing.textContent = payload;
        return;
    }

    const script = document.createElement('script');
    script.id = jsonLdElementId;
    script.type = 'application/ld+json';
    script.textContent = payload;
    document.head.appendChild(script);
};

watch(structuredDataJson, (value) => {
    syncJsonLd(value);
}, { immediate: true });

onBeforeUnmount(() => {
    if (typeof document === 'undefined') {
        return;
    }

    const existing = document.getElementById(jsonLdElementId);
    if (existing) {
        existing.remove();
    }
});

// Lightbox state
const selectedImage = ref(null);
const showContact = ref(false);
const form = useForm({
    name: page.props.auth?.user?.name ?? '',
    email: page.props.auth?.user?.email ?? '',
    phone: '',
    message: '',
});
const showFlag = ref(false);
const flagForm = useForm({
    reason: '',
    categories: [],
});

const showAdminFlagBanner = computed(() => {
    return page.props.auth?.user?.is_admin && props.listing.pending_flags_count >= 5;
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

const openFlag = () => {
    showFlag.value = true;
};

const closeFlag = () => {
    showFlag.value = false;
    flagForm.reset();
    flagForm.clearErrors();
};

const submitFlag = () => {
    flagForm.post(`/listings/${props.listing.id}/flag`, {
        preserveScroll: true,
        onSuccess: closeFlag,
    });
};
</script>

<template>
    <Head>
        <title>{{ listing.company_name }} | Photography Directory</title>
        <meta name="description" :content="metaDescription" />
        <meta property="og:title" :content="listing.company_name" />
        <meta property="og:description" :content="metaDescription" />
        <meta property="og:image" :content="ogImage" />
        <meta property="og:type" content="website" />
        <meta property="og:url" :content="canonicalUrl" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" :content="listing.company_name" />
        <meta name="twitter:description" :content="metaDescription" />
        <meta name="twitter:image" :content="ogImage" />
        <link rel="canonical" :href="canonicalUrl" />
    </Head>
    <AppLayout>
        <div
            v-if="showAdminFlagBanner"
            class="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-3 flex items-start gap-3"
        >
            <svg class="w-5 h-5 mt-0.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div class="text-sm">
                <p class="font-semibold">Hidden from public due to a pending report.</p>
                <p class="mt-1">
                    Review and resolve in
                    <Link href="/admin/flags" class="underline font-semibold text-amber-800 hover:text-amber-900">
                        Admin Flags
                    </Link>
                    to restore visibility.
                </p>
            </div>
        </div>
        <!-- Hero Section -->
        <section class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black overflow-hidden">
            <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0); background-size: 34px 34px;"></div>
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-20 md:pb-28">
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
                        <div class="flex items-center space-x-3">
                            <button
                                type="button"
                                class="w-2/3 inline-flex items-center justify-center px-5 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
                                @click="openContact"
                            >
                                Get in Touch
                            </button>
                            <button
                                type="button"
                                class="w-1/3 inline-flex items-center justify-center px-5 py-3 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors"
                                @click="openFlag"
                            >
                                Report listing
                            </button>
                            <p
                                v-if="flash?.success"
                                class="text-sm text-emerald-600"
                            >
                                {{ flash.success }}
                            </p>
                        </div>
                    </div>

                    <div></div>
                </div>
            </div>
        </section>

        <section class="py-14 md:py-18 bg-slate-50 dark:bg-slate-900">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
                    <div v-if="listing.description" class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">About</h2>
                        <div
                            class="prose prose-sm max-w-none text-slate-700 dark:text-slate-200 dark:prose-invert prose-p:leading-relaxed"
                            v-html="listing.description"
                        ></div>
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
                                <Link
                                    v-for="portfolio in listing.portfolios"
                                    :key="portfolio.id"
                                    :href="`/portfolios/${portfolio.id}`"
                                    class="flex items-center gap-4 group rounded-xl border border-transparent hover:border-primary-200 dark:hover:border-primary-900/60 hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition-colors px-2 py-2"
                                >
                                    <div class="w-24 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                                        <img
                                            v-if="portfolio.images?.[0]"
                                            :src="portfolio.images[0].url"
                                            :alt="portfolio.name"
                                            class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                                        />
                                    </div>
                                    <div>
                                        <p class="font-medium text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors">
                                            {{ portfolio.name }}
                                        </p>
                                        <p class="text-sm text-slate-500 dark:text-slate-400">{{ portfolio.images?.length || 0 }} images</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div v-if="listing.images?.length > 0" class="lg:col-span-3 space-y-4">
                        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Gallery</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            <button
                                v-for="image in listing.images"
                                :key="image.id"
                                type="button"
                                class="group relative block w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                @click="openLightbox(image)"
                            >
                                <div class="aspect-square">
                                    <img
                                        :src="image.url"
                                        :alt="image.filename"
                                        class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                    />
                                </div>
                            </button>
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

        <!-- Flag Modal -->
        <Teleport to="body">
            <div
                v-if="showFlag"
                class="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeFlag"></div>

                <div class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Report listing</p>
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                {{ listing.company_name }}
                            </h3>
                        </div>
                        <button
                            type="button"
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            @click="closeFlag"
                            aria-label="Close flag modal"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form class="mt-4 space-y-4" @submit.prevent="submitFlag">
                        <div class="space-y-2">
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Select issues</p>
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400">
                                    <input
                                        v-model="flagForm.categories"
                                        type="checkbox"
                                        value="spam"
                                        class="accent-primary-500"
                                    />
                                    <span>Spam or ads</span>
                                </label>
                                <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400">
                                    <input
                                        v-model="flagForm.categories"
                                        type="checkbox"
                                        value="scam"
                                        class="accent-primary-500"
                                    />
                                    <span>Scam or fraud</span>
                                </label>
                                <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400">
                                    <input
                                        v-model="flagForm.categories"
                                        type="checkbox"
                                        value="inaccurate"
                                        class="accent-primary-500"
                                    />
                                    <span>Inaccurate info</span>
                                </label>
                                <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400">
                                    <input
                                        v-model="flagForm.categories"
                                        type="checkbox"
                                        value="offensive"
                                        class="accent-primary-500"
                                    />
                                    <span>Offensive content</span>
                                </label>
                                <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 col-span-2">
                                    <input
                                        v-model="flagForm.categories"
                                        type="checkbox"
                                        value="other"
                                        class="accent-primary-500"
                                    />
                                    <span>Something else</span>
                                </label>
                            </div>
                            <p v-if="flagForm.errors.categories" class="text-sm text-red-500 mt-1">{{ flagForm.errors.categories }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional details (optional)</label>
                            <textarea
                                v-model="flagForm.reason"
                                rows="4"
                                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            ></textarea>
                            <p v-if="flagForm.errors.reason" class="text-sm text-red-500 mt-1">{{ flagForm.errors.reason }}</p>
                        </div>

                        <div class="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                @click="closeFlag"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="inline-flex items-center px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                                :disabled="flagForm.processing"
                            >
                                <svg
                                    v-if="flagForm.processing"
                                    class="animate-spin h-4 w-4 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Submit report
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
