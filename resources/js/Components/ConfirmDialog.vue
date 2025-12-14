<script setup>
import { computed, watch, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: 'Are you sure?',
    },
    message: {
        type: String,
        default: '',
    },
    confirmText: {
        type: String,
        default: 'Confirm',
    },
    cancelText: {
        type: String,
        default: 'Cancel',
    },
    danger: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['confirm', 'cancel', 'update:show']);

const visible = computed({
    get: () => props.show,
    set: (value) => emit('update:show', value),
});

const close = () => {
    visible.value = false;
    emit('cancel');
};

const onConfirm = () => {
    emit('confirm');
};

const onKeydown = (event) => {
    if (event.key === 'Escape' && visible.value) {
        close();
    }
};

watch(() => props.show, (value) => {
    if (value) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
});

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
    document.body.classList.remove('overflow-hidden');
});
</script>

<template>
    <Teleport to="body">
        <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>
            <div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-300" v-if="message">
                        {{ message }}
                    </p>
                </div>
                <div class="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        @click="close"
                    >
                        {{ cancelText }}
                    </button>
                    <button
                        type="button"
                        class="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors"
                        :class="danger
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-primary-600 text-white hover:bg-primary-700'"
                        @click="onConfirm"
                    >
                        {{ confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
