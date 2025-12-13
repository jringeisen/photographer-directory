<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    photographyTypes: Array,
    modelValue: {
        type: Array,
        default: () => [],
    },
    customTypes: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['update:modelValue', 'update:customTypes']);

const newCustomType = ref('');

const predefinedTypes = computed(() => {
    return props.photographyTypes.filter(t => t.is_predefined);
});

const toggleType = (typeId) => {
    const current = [...(props.modelValue || [])];
    const index = current.indexOf(typeId);

    if (index === -1) {
        current.push(typeId);
    } else {
        current.splice(index, 1);
    }

    emit('update:modelValue', current);
};

const addCustomType = () => {
    const trimmed = newCustomType.value.trim();
    if (trimmed && !(props.customTypes || []).includes(trimmed)) {
        const current = [...(props.customTypes || [])];
        current.push(trimmed);
        emit('update:customTypes', current);
        newCustomType.value = '';
    }
};

const removeCustomType = (index) => {
    const current = [...(props.customTypes || [])];
    current.splice(index, 1);
    emit('update:customTypes', current);
};
</script>

<template>
    <div class="space-y-4">
        <!-- Predefined Types -->
        <div class="flex flex-wrap gap-2">
            <button
                v-for="type in predefinedTypes"
                :key="type.id"
                type="button"
                @click="toggleType(type.id)"
                :class="[
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    modelValue?.includes(type.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
            >
                {{ type.name }}
            </button>
        </div>

        <!-- Custom Types -->
        <div v-if="customTypes?.length > 0" class="flex flex-wrap gap-2">
            <span
                v-for="(type, index) in customTypes"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
            >
                {{ type }}
                <button
                    type="button"
                    @click="removeCustomType(index)"
                    class="ml-1 text-green-600 hover:text-green-800"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </span>
        </div>

        <!-- Add Custom Type -->
        <div class="flex gap-2">
            <input
                v-model="newCustomType"
                type="text"
                placeholder="Add custom type..."
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter.prevent="addCustomType"
            />
            <button
                type="button"
                @click="addCustomType"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
                Add
            </button>
        </div>
    </div>
</template>
