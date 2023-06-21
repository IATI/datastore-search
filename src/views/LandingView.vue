<script setup>
import { inject, provide, onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchBar from '../components/SearchBar.vue';
import SearchResults from '../components/SearchResults.vue';
import AdvancedSearchBar from '../components/AdvancedSearchBar.vue';

const global = inject('global');
const showAdvancedSearch = ref(false);
provide('showAdvancedSearch', showAdvancedSearch);
const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
    sessionStorage.removeItem('searchterm');
    const { q } = route.query;
    if (q) {
        sessionStorage.setItem('searchterm', JSON.stringify(q));
        global.runSimple(q);
    }
});

const onSearch = (query) => {
    if (query) {
        router.push({ path: '/', query: { q: query } });
        global.runSimple(query);
    }
};

watch(
    () => global.state.queryInProgress,
    () => {
        if (global.state.queryInProgress) {
            showAdvancedSearch.value = false;
        }
    }
);
</script>

<template>
    <div class="flex h-5/6">
        <div
            v-if="!global.state.queryInProgress && global.state.responseTotal === null"
            class="m-auto"
        >
            <SearchBar class="landing" @search="onSearch" />
            <button
                class="bg-slate-100 hover:bg-slate-300 text-slate-600 py-2 px-4 rounded"
                data-cy="advanced-search-landing"
                @click="showAdvancedSearch = true"
            >
                {{ $t('message.switch_to_advanced_search') }}
            </button>
        </div>
        <div
            v-if="global.state.queryInProgress || global.state.responseTotal != null"
            class="flex-grow"
        >
            <SearchResults />
        </div>
    </div>
    <teleport to="#searchbar">
        <AdvancedSearchBar />
    </teleport>
</template>
