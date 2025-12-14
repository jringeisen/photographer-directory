<script setup>
import { Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import ConfirmDialog from '@/Components/ConfirmDialog.vue';

const props = defineProps({
    request: Object,
});

const showApprove = ref(false);
const showReject = ref(false);
const adminNotes = ref(props.request.admin_notes || '');

const approve = () => {
    router.post(`/admin/verification/${props.request.id}/approve`, { admin_notes: adminNotes.value }, {
        preserveScroll: true,
    });
    showApprove.value = false;
};

const reject = () => {
    router.post(`/admin/verification/${props.request.id}/reject`, { admin_notes: adminNotes.value }, {
        preserveScroll: true,
    });
    showReject.value = false;
};

const impersonateUser = () => {
    router.post(`/admin/impersonate/${props.request.user.id}`, {}, {
        preserveScroll: true,
    });
};
</script>

<template>
    <AppLayout>
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <p class="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Admin</p>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Review verification</h1>
                    <p class="text-gray-600 dark:text-gray-300">Request #{{ request.id }}</p>
                </div>
                <Link href="/admin/verification" class="text-sm text-primary-600 dark:text-primary-400 hover:underline">Back to list</Link>
            </div>

            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-6">
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="{
                        'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200': request.status === 'pending' || request.status === 'in_review',
                        'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200': request.status === 'approved',
                        'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200': request.status === 'rejected',
                    }">
                        {{ request.status.replace('_', ' ') }}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        Submitted {{ request.submitted_at ? new Date(request.submitted_at).toLocaleString() : '—' }}
                    </span>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Business</h2>
                        <div class="space-y-2 text-gray-700 dark:text-gray-200">
                            <div><span class="font-semibold">Name:</span> {{ request.business_name }}</div>
                            <div><span class="font-semibold">Entity:</span> {{ request.legal_entity_type || '—' }}</div>
                            <div><span class="font-semibold">Registration #:</span> {{ request.registration_number || '—' }}</div>
                            <div><span class="font-semibold">State:</span> {{ request.registration_state || '—' }}</div>
                            <div><span class="font-semibold">Address:</span> {{ request.business_address || '—' }}</div>
                            <div>
                                <span class="font-semibold">Website:</span>
                                <a v-if="request.website" :href="request.website" target="_blank" class="text-primary-600 dark:text-primary-400 hover:underline">{{ request.website }}</a>
                                <span v-else>—</span>
                            </div>
                            <div>
                                <span class="font-semibold">BBB:</span>
                                <a v-if="request.bbb_profile_url" :href="request.bbb_profile_url" target="_blank" class="text-primary-600 dark:text-primary-400 hover:underline">{{ request.bbb_profile_url }}</a>
                                <span v-else>—</span>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Owner</h2>
                        <div class="space-y-2 text-gray-700 dark:text-gray-200">
                            <div><span class="font-semibold">Name:</span> {{ request.owner_name }}</div>
                            <div><span class="font-semibold">Email:</span> {{ request.owner_email }}</div>
                            <div><span class="font-semibold">Phone:</span> {{ request.owner_phone || '—' }}</div>
                            <div class="pt-2 border-t border-gray-200 dark:border-gray-800">
                                <p class="text-sm text-gray-500 dark:text-gray-400">User</p>
                                <p class="text-sm text-gray-800 dark:text-gray-200">
                                    {{ request.user.name }} ({{ request.user.email }}) — status: {{ request.user.verification_status }}
                                </p>
                                <button
                                    type="button"
                                    class="mt-2 inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700"
                                    @click="impersonateUser"
                                >
                                    Impersonate user
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Admin notes</label>
                    <textarea
                        v-model="adminNotes"
                        rows="3"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    ></textarea>
                </div>

                <div class="flex flex-wrap gap-3 justify-end">
                    <button
                        type="button"
                        class="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                        @click="showReject = true"
                    >
                        Reject
                    </button>
                    <button
                        type="button"
                        class="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                        @click="showApprove = true"
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>

        <ConfirmDialog
            :show="showApprove"
            title="Approve verification?"
            :message="`Mark ${request.business_name} as verified and badge their listings.`"
            confirm-text="Approve"
            cancel-text="Cancel"
            :danger="false"
            @update:show="showApprove = $event"
            @confirm="approve"
        />

        <ConfirmDialog
            :show="showReject"
            title="Reject verification?"
            :message="`Reject ${request.business_name}. Their listings will be hidden until re-approved.`"
            confirm-text="Reject"
            cancel-text="Cancel"
            @update:show="showReject = $event"
            @confirm="reject"
        />
    </AppLayout>
</template>
