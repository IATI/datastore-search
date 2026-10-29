<script setup>
import { inject, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchBar from '../components/SearchBar.vue';
import SearchResults from '../components/SearchResults.vue';

const global = inject('global');
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
</script>

<template>
    <div class="flex h-5/6">
        <div
            v-if="
                !global.state.queryInProgress &&
                global.state.responseTotal === null
            "
            class="w-full mx-16 my-auto"
        >
            <SearchBar class="landing w-full mr-2" @search="onSearch" />
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
</template>
