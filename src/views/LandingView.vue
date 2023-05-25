<script setup>
import { onBeforeMount } from 'vue';
import SearchBar from '../components/SearchBar.vue';

onBeforeMount(() => {
    sessionStorage.removeItem('searchterm');
});
</script>

<template>
    <div class="flex h-5/6">
        <div class="m-auto">
            <SearchBar class="landing" />
            <router-link
                to="/advanced"
                class="bg-slate-100 hover:bg-slate-300 text-slate-600 py-2 px-4 rounded hide-on-mobile"
                >{{ $t('message.switch_to_advanced_search') }}</router-link
            >
        </div>
    </div>
</template>
