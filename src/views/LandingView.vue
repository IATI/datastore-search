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
    },
);
</script>

<template>
    <div class="flex h-5/6">
        <div
            v-if="
                !global.state.queryInProgress &&
                global.state.responseTotal === null
            "
            class="inline-flex w-full mx-16 my-auto"
        >
            <SearchBar class="landing w-full mr-2" @search="onSearch" />
            <button
                class="iati-button"
                data-cy="advanced-search-landing"
                @click="showAdvancedSearch = true"
            >
                {{ $t('message.advanced') }}
            </button>
        </div>
        <div
            v-if="
                global.state.queryInProgress ||
                global.state.responseTotal != null
            "
            class="flex-grow"
        >
            <SearchResults />
        </div>
    </div>
    <teleport to="#searchbar">
        <AdvancedSearchBar />
    </teleport>
</template>
