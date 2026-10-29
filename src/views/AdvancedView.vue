<script setup>
import SideBar from '../components/SideBar.vue';
</script>

<template>
    <div class="mx-5 my-6 text-left" data-cy="advanced-search-page">
        <h1 class="text-3xl font-semibold">
            {{ $t('message.advanced_search') }}
        </h1>
        <SideBar />
    </div>
</template>
