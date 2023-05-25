<script setup>
import { inject, provide, onBeforeMount, ref } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import SearchResults from '../components/SearchResults.vue';
import AdvancedSearchBar from '../components/AdvancedSearchBar.vue';

const global = inject('global');
const showAdvancedSearch = ref(false);
provide('showAdvancedSearch', showAdvancedSearch);

onBeforeMount(() => {
    sessionStorage.removeItem('searchterm');
});

const searching = ref(false);

const onSearch = (query) => {
    if (query) {
        searching.value = true;
        global.runSimple(query);
    }
};
</script>

<template>
    <div class="flex h-5/6">
        <div v-if="!searching" class="m-auto">
            <SearchBar class="landing" @search="onSearch" />
            <button
                class="bg-slate-100 hover:bg-slate-300 text-slate-600 py-2 px-4 rounded hide-on-mobile"
                @click="showAdvancedSearch = true"
            >
                {{ $t('message.switch_to_advanced_search') }}
            </button>
        </div>
        <div v-else>
            <SearchResults />
        </div>
    </div>
    <teleport to="#searchbar">
        <AdvancedSearchBar :show="showAdvancedSearch" />
    </teleport>
</template>
