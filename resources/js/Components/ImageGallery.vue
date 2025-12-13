<script setup>
import { ref } from 'vue';

const props = defineProps({
    images: Array,
});

const selectedIndex = ref(null);

const openLightbox = (index) => {
    selectedIndex.value = index;
};

const closeLightbox = () => {
    selectedIndex.value = null;
};

const navigate = (direction) => {
    if (selectedIndex.value !== null) {
        const newIndex = selectedIndex.value + direction;
        if (newIndex >= 0 && newIndex < props.images.length) {
            selectedIndex.value = newIndex;
        }
    }
};

const handleKeydown = (e) => {
    if (selectedIndex.value === null) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
};
</script>

<template>
    <div @keydown="handleKeydown" tabindex="0">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
                v-for="(image, index) in images"
                :key="image.id"
                class="aspect-square cursor-pointer overflow-hidden rounded-lg"
                @click="openLightbox(index)"
            >
                <img
                    :src="image.url"
                    :alt="image.filename"
                    class="w-full h-full object-cover hover:scale-105 transition-transform"
                />
            </div>
        </div>

        <!-- Lightbox -->
        <Teleport to="body">
            <div
                v-if="selectedIndex !== null"
                class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                @click="closeLightbox"
            >
                <button
                    class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
                    @click="closeLightbox"
                >
                    &times;
                </button>
                <button
                    v-if="selectedIndex > 0"
                    class="absolute left-4 text-white text-6xl hover:text-gray-300 z-10"
                    @click.stop="navigate(-1)"
                >
                    &lsaquo;
                </button>
                <img
                    :src="images[selectedIndex].url"
                    class="max-h-[90vh] max-w-[90vw] object-contain"
                    @click.stop
                />
                <button
                    v-if="selectedIndex < images.length - 1"
                    class="absolute right-4 text-white text-6xl hover:text-gray-300 z-10"
                    @click.stop="navigate(1)"
                >
                    &rsaquo;
                </button>
            </div>
        </Teleport>
    </div>
</template>
