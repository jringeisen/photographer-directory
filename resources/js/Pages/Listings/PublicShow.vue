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
        <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-20">
                <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 40px 40px;"></div>
            </div>

            <!-- Gradient Orbs -->
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-28 md:pb-36">
                <!-- Back Link -->
                <Link
                    href="/"
                    class="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-12"
                >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Browse
                </Link>

                <div class="text-center">
                    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
                        {{ listing.company_name }}
                    </h1>

                    <p class="text-xl text-gray-300 mb-10">
                        {{ listing.city }}, {{ listing.state }}
                    </p>

                    <div class="flex flex-wrap justify-center gap-3 mb-8">
                        <span
                            v-for="type in listing.photography_types"
                            :key="type.id"
                            class="px-4 py-2 rounded-full text-sm font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20"
                        >
                            {{ type.name }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Wave Divider -->
            <div class="absolute bottom-0 left-0 right-0">
                <svg class="w-full h-12 md:h-16 text-gray-50 dark:text-gray-900" viewBox="0 0 1440 74" fill="currentColor" preserveAspectRatio="none">
                    <path d="M0,74 L1440,74 L1440,0 C1200,50 960,74 720,74 C480,74 240,50 0,0 L0,74 Z"></path>
                </svg>
            </div>
        </section>

        <!-- Main Content -->
        <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <!-- Two Column Layout -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    <!-- Left Column: About + Contact -->
                    <div class="space-y-12">
                        <!-- About -->
                        <div v-if="listing.description">
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
                            <div
                                class="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:leading-relaxed"
                                v-html="listing.description"
                            ></div>
                        </div>

                        <!-- Contact Info -->
                        <div>
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact</h2>
                            <div class="space-y-3 text-gray-600 dark:text-gray-300">
                                <a v-if="listing.email" :href="`mailto:${listing.email}`" class="flex items-center gap-3 hover:text-primary-500 transition-colors">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {{ listing.email }}
                                </a>
                                <a v-if="listing.phone" :href="`tel:${listing.phone}`" class="flex items-center gap-3 hover:text-primary-500 transition-colors">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {{ listing.phone }}
                                </a>
                                <div class="flex items-center gap-3">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {{ listing.city }}, {{ listing.state }}
                                </div>
                            </div>

                            <div class="mt-6 space-y-3">
                                <button
                                    type="button"
                                    class="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                                    @click="openContact"
                                >
                                    Get in Touch
                                </button>
                                <p
                                    v-if="flash?.success"
                                    class="text-sm text-green-600 dark:text-green-400"
                                >
                                    {{ flash.success }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Images -->
                    <div v-if="listing.images?.length > 0" class="columns-2 gap-4 space-y-4">
                        <div
                            v-for="image in listing.images"
                            :key="image.id"
                            class="break-inside-avoid cursor-pointer"
                            @click="openLightbox(image)"
                        >
                            <img
                                :src="image.url"
                                :alt="image.filename"
                                class="w-full rounded-lg hover:opacity-90 transition-opacity"
                            />
                        </div>
                    </div>

                </div>

                <!-- Portfolios (Full Width Below) -->
                <div v-if="listing.portfolios?.length > 0" class="mt-20">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Portfolios</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            v-for="portfolio in listing.portfolios"
                            :key="portfolio.id"
                            class="group"
                        >
                            <div class="aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-3">
                                <img
                                    v-if="portfolio.images?.[0]"
                                    :src="portfolio.images[0].url"
                                    :alt="portfolio.name"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <p class="text-gray-900 dark:text-white font-medium">{{ portfolio.name }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ portfolio.images?.length || 0 }} images</p>
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
