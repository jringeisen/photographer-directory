<script setup>
defineProps({
    stats: Object,
});
</script>

<template>
    <div class="flex flex-wrap justify-center gap-8 md:gap-16">
        <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-primary-400">
                {{ stats?.totalPhotographers?.toLocaleString() || '0' }}
            </div>
            <div class="text-sm text-gray-400 mt-1">Photographers</div>
        </div>
        <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-primary-400">
                {{ stats?.totalImages?.toLocaleString() || '0' }}
            </div>
            <div class="text-sm text-gray-400 mt-1">Photos</div>
        </div>
        <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-primary-400">
                {{ stats?.totalPortfolios?.toLocaleString() || '0' }}
            </div>
            <div class="text-sm text-gray-400 mt-1">Portfolios</div>
        </div>
    </div>
</template>
