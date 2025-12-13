<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: 'Write something...',
    },
});

const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: props.placeholder,
        }),
    ],
    content: props.modelValue,
    editorProps: {
        attributes: {
            class: 'prose prose-sm max-w-none focus:outline-none min-h-[120px] px-3 py-2',
        },
    },
    onUpdate: () => {
        emit('update:modelValue', editor.value.getHTML());
    },
});

watch(() => props.modelValue, (value) => {
    const isSame = editor.value.getHTML() === value;
    if (!isSame) {
        editor.value.commands.setContent(value, false);
    }
});
</script>

<template>
    <div class="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
        <!-- Toolbar -->
        <div class="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            <button
                type="button"
                @click="editor.chain().focus().toggleBold().run()"
                :class="[
                    'p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors',
                    { 'bg-gray-200 dark:bg-gray-600': editor?.isActive('bold') }
                ]"
                title="Bold"
            >
                <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6V4zm0 8h9a4 4 0 014 4 4 4 0 01-4 4H6v-8z" />
                </svg>
            </button>

            <button
                type="button"
                @click="editor.chain().focus().toggleItalic().run()"
                :class="[
                    'p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors',
                    { 'bg-gray-200 dark:bg-gray-600': editor?.isActive('italic') }
                ]"
                title="Italic"
            >
                <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 0v16m4-16h-4m4 16h-4" transform="skewX(-10)" />
                </svg>
            </button>

            <div class="w-px h-5 bg-gray-300 dark:bg-gray-500 mx-1"></div>

            <button
                type="button"
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="[
                    'px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300',
                    { 'bg-gray-200 dark:bg-gray-600': editor?.isActive('heading', { level: 2 }) }
                ]"
                title="Heading 2"
            >
                H2
            </button>

            <button
                type="button"
                @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="[
                    'px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300',
                    { 'bg-gray-200 dark:bg-gray-600': editor?.isActive('heading', { level: 3 }) }
                ]"
                title="Heading 3"
            >
                H3
            </button>

            <div class="w-px h-5 bg-gray-300 dark:bg-gray-500 mx-1"></div>

            <button
                type="button"
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="[
                    'p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors',
                    { 'bg-gray-200 dark:bg-gray-600': editor?.isActive('bulletList') }
                ]"
                title="Bullet List"
            >
                <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    <circle cx="2" cy="6" r="1" fill="currentColor" />
                    <circle cx="2" cy="12" r="1" fill="currentColor" />
                    <circle cx="2" cy="18" r="1" fill="currentColor" />
                </svg>
            </button>

            <button
                type="button"
                @click="editor.chain().focus().toggleOrderedList().run()"
                :class="[
                    'p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors',
                    { 'bg-gray-200 dark:bg-gray-600': editor?.isActive('orderedList') }
                ]"
                title="Ordered List"
            >
                <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6h13M7 12h13M7 18h13" />
                    <text x="2" y="8" font-size="6" fill="currentColor">1</text>
                    <text x="2" y="14" font-size="6" fill="currentColor">2</text>
                    <text x="2" y="20" font-size="6" fill="currentColor">3</text>
                </svg>
            </button>
        </div>

        <!-- Editor Content -->
        <div class="bg-white dark:bg-gray-800">
            <EditorContent :editor="editor" />
        </div>
    </div>
</template>

<style>
.tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #9ca3af;
    pointer-events: none;
    height: 0;
}

.tiptap:focus {
    outline: none;
}

.tiptap h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.tiptap h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
}

.tiptap ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
}

.tiptap ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
}

.tiptap p {
    margin: 0.5rem 0;
}

.tiptap p:first-child {
    margin-top: 0;
}

.tiptap p:last-child {
    margin-bottom: 0;
}
</style>
