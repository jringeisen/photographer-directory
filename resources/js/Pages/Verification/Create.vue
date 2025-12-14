<script setup>
import { Link, useForm, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';

const page = usePage();

const props = defineProps({
    existingRequest: Object,
});

const form = useForm({
    business_name: props.existingRequest?.business_name || '',
    legal_entity_type: props.existingRequest?.legal_entity_type || '',
    registration_number: props.existingRequest?.registration_number || '',
    registration_state: props.existingRequest?.registration_state || '',
    business_address: props.existingRequest?.business_address || '',
    owner_name: props.existingRequest?.owner_name || page.props.auth?.user?.name || '',
    owner_email: props.existingRequest?.owner_email || page.props.auth?.user?.email || '',
    owner_phone: props.existingRequest?.owner_phone || '',
    website: props.existingRequest?.website || '',
    bbb_profile_url: props.existingRequest?.bbb_profile_url || '',
});

const hasPending = ['pending', 'in_review'].includes(props.existingRequest?.status);
</script>

<template>
    <AppLayout>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-6">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <p class="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Verification</p>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Submit verification</h1>
                        <p class="text-gray-600 dark:text-gray-300 mt-1">Provide business details so we can verify your listings.</p>
                    </div>
                    <div v-if="existingRequest" class="px-3 py-1 rounded-full text-xs font-semibold border" :class="{
                        'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800': existingRequest.status === 'pending' || existingRequest.status === 'in_review',
                        'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800': existingRequest.status === 'approved',
                        'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 border-red-200 dark:border-red-800': existingRequest.status === 'rejected',
                    }">
                        {{ existingRequest.status?.replace('_', ' ') }}
                    </div>
                </div>

                <div v-if="existingRequest?.admin_notes" class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200">
                    <p class="font-semibold mb-1">Reviewer notes</p>
                    <p>{{ existingRequest.admin_notes }}</p>
                </div>

                <form class="space-y-6" @submit.prevent="form.post('/verification')">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Business name *</label>
                            <input v-model="form.business_name" :disabled="hasPending" required class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <p v-if="form.errors.business_name" class="text-sm text-red-500">{{ form.errors.business_name }}</p>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Legal entity type</label>
                            <input v-model="form.legal_entity_type" :disabled="hasPending" class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="LLC, Corp, Sole Prop">
                            <p v-if="form.errors.legal_entity_type" class="text-sm text-red-500">{{ form.errors.legal_entity_type }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Registration number</label>
                            <input v-model="form.registration_number" :disabled="hasPending" class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <p v-if="form.errors.registration_number" class="text-sm text-red-500">{{ form.errors.registration_number }}</p>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Registration state</label>
                            <input v-model="form.registration_state" :disabled="hasPending" class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <p v-if="form.errors.registration_state" class="text-sm text-red-500">{{ form.errors.registration_state }}</p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Business address</label>
                        <input v-model="form.business_address" :disabled="hasPending" class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <p v-if="form.errors.business_address" class="text-sm text-red-500">{{ form.errors.business_address }}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Owner name *</label>
                            <input v-model="form.owner_name" :disabled="hasPending" required class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <p v-if="form.errors.owner_name" class="text-sm text-red-500">{{ form.errors.owner_name }}</p>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Owner email *</label>
                            <input v-model="form.owner_email" type="email" :disabled="hasPending" required class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <p v-if="form.errors.owner_email" class="text-sm text-red-500">{{ form.errors.owner_email }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Owner phone</label>
                            <input v-model="form.owner_phone" :disabled="hasPending" class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <p v-if="form.errors.owner_phone" class="text-sm text-red-500">{{ form.errors.owner_phone }}</p>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Website</label>
                            <input v-model="form.website" :disabled="hasPending" class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <p v-if="form.errors.website" class="text-sm text-red-500">{{ form.errors.website }}</p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-200">BBB profile URL</label>
                        <input v-model="form.bbb_profile_url" :disabled="hasPending" class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://www.bbb.org/...">
                        <p v-if="form.errors.bbb_profile_url" class="text-sm text-red-500">{{ form.errors.bbb_profile_url }}</p>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                        <Link href="/dashboard" class="text-sm text-gray-700 dark:text-gray-300 hover:underline">Cancel</Link>
                        <button
                            type="submit"
                            :disabled="form.processing || hasPending"
                            class="px-5 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60"
                        >
                            <span v-if="form.processing">Submitting...</span>
                            <span v-else-if="hasPending">Under review</span>
                            <span v-else>Submit for verification</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>
