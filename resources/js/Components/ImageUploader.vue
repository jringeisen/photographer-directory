<script setup>
import axios from 'axios';
import { computed, ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    existingImages: {
        type: Array,
        default: () => [],
    },
    maxImages: {
        type: Number,
        default: 10,
    },
    purpose: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'remove-existing']);

const uploads = ref([]);
const removedExisting = ref([]);
const selectedIds = ref([...props.modelValue]);
const uploadErrors = ref([]);

watch(
    () => props.modelValue,
    (value) => {
        selectedIds.value = [...value];
    }
);

const activeExisting = computed(() => props.existingImages.filter(img => !removedExisting.value.includes(img.id)));
const remainingSlots = computed(() => Math.max(
    0,
    props.maxImages - activeExisting.value.length - uploads.value.length,
));

const updateModel = () => emit('update:modelValue', selectedIds.value);

const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);
    const allowedFiles = files.slice(0, remainingSlots.value);

    allowedFiles.forEach((file) => startUpload(file));
    event.target.value = '';
};

const startUpload = async (file) => {
    uploadErrors.value = [];
    const upload = {
        id: null,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'starting',
        previewUrl: URL.createObjectURL(file),
        error: null,
    };

    uploads.value.push(upload);

    try {
        const { data } = await axios.post('/uploads/sessions', {
            filename: file.name,
            content_length: file.size,
            content_type: file.type,
            purpose: props.purpose,
        });

        upload.id = data.id;
        upload.status = 'uploading';

        const parts = await uploadParts(file, data.part_size, data.urls, upload);
        upload.status = 'processing';

        await axios.post(`/uploads/sessions/${data.id}/complete`, {
            parts,
        });

        upload.status = 'complete';
        upload.progress = 100;
        selectedIds.value.push(data.id);
        updateModel();
    } catch (error) {
        upload.status = 'error';
        upload.error = error.response?.data?.message || 'Upload failed. Please try again.';
        uploadErrors.value.push(upload.error);
    }
};

const uploadParts = async (file, partSize, urls, upload) => {
    const parts = [];

    for (const part of urls) {
        const start = (part.part_number - 1) * partSize;
        const end = Math.min(start + partSize, file.size);
        const chunk = file.slice(start, end);

        const response = await fetch(part.url, {
            method: 'PUT',
            body: chunk,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!response.ok) {
            throw new Error('Chunk upload failed');
        }

        const etag = response.headers.get('ETag')?.replaceAll('"', '');
        parts.push({ part_number: part.part_number, etag });
        upload.progress = Math.min(99, Math.round((end / file.size) * 100));
    }

    return parts;
};

const removeExisting = (imageId) => {
    removedExisting.value.push(imageId);
    emit('remove-existing', imageId);
};

const removeUpload = async (publicId) => {
    const index = uploads.value.findIndex(upload => upload.id === publicId);

    if (index !== -1) {
        const [upload] = uploads.value.splice(index, 1);
        selectedIds.value = selectedIds.value.filter(id => id !== publicId);
        updateModel();

        if (publicId) {
            try {
                await axios.delete(`/uploads/sessions/${publicId}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }

        if (upload.previewUrl) {
            URL.revokeObjectURL(upload.previewUrl);
        }
    }
};

const formatSize = (bytes) => {
    if (!bytes) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);

    return `${(bytes / 1024 ** exponent).toFixed(1)} ${units[exponent]}`;
};
</script>

<template>
    <div class="space-y-4">
        <div
            v-if="uploadErrors.length"
            class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
            <p class="font-medium">Upload issues</p>
            <ul class="list-disc pl-4">
                <li v-for="(error, index) in uploadErrors" :key="index">
                    {{ error }}
                </li>
            </ul>
        </div>

        <div v-if="activeExisting.length > 0" class="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div
                v-for="image in activeExisting"
                :key="image.id"
                class="relative overflow-hidden rounded-lg border border-gray-200 aspect-square"
            >
                <img :src="image.url" class="h-full w-full object-cover" />
                <button
                    type="button"
                    @click="removeExisting(image.id)"
                    class="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white hover:bg-black/90"
                >
                    Remove
                </button>
            </div>
        </div>

        <div v-if="uploads.length" class="space-y-2">
            <div
                v-for="upload in uploads"
                :key="upload.id || upload.name"
                class="flex items-center justify-between rounded-lg border border-gray-200 p-3"
            >
                <div class="flex items-center gap-3">
                    <div class="h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                        <img
                            v-if="upload.previewUrl"
                            :src="upload.previewUrl"
                            class="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-900">{{ upload.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatSize(upload.size) }}</p>
                        <div class="mt-2 h-2 w-48 overflow-hidden rounded-full bg-gray-100">
                            <div
                                class="h-2 rounded-full bg-blue-500 transition-all"
                                :style="{ width: `${upload.progress}%` }"
                            />
                        </div>
                        <p class="mt-1 text-xs uppercase tracking-wide text-gray-500">
                            <span v-if="upload.status === 'complete'" class="text-green-600">Ready</span>
                            <span v-else-if="upload.status === 'processing'">Finalizing...</span>
                            <span v-else-if="upload.status === 'uploading'">Uploading...</span>
                            <span v-else-if="upload.status === 'error'" class="text-red-600">Error</span>
                            <span v-else>Starting...</span>
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    class="text-sm text-red-600 hover:text-red-700"
                    @click="removeUpload(upload.id)"
                >
                    Remove
                </button>
            </div>
        </div>

        <div v-if="remainingSlots > 0" class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <label class="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 px-4 text-center hover:bg-gray-100">
                <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div class="text-sm text-gray-700">
                    Drag and drop or <span class="font-medium text-blue-600">browse</span> high-quality images
                </div>
                <p class="text-xs text-gray-500">Up to {{ remainingSlots }} more images</p>
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    class="hidden"
                    @change="handleFileSelect"
                />
            </label>
        </div>
        <p v-else class="text-sm text-gray-500 text-center">
            Maximum images reached
        </p>
    </div>
</template>
