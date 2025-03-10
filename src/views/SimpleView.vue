<script setup>
import { inject, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import DownloadButtons from '../components/DownloadButtons.vue';
import ResultList from '../components/ResultList.vue';
import SearchBar from '../components/SearchBar.vue';
import SortButtons from '../components/SortButtons.vue';
import { formatNumber } from '../utils';

const global = inject('global');
const showAdvancedSearch = inject('showAdvancedSearch');
const router = useRouter();

onBeforeUnmount(() => {
    sessionStorage.removeItem('searchterm');
});

const onSearch = (query) => {
    if (query) {
        global.resetFilters();
        global.runSimple(query);
        router.push({ path: '/', query: { q: query } });
    }
};
</script>

<template>
    <div class="flex flex-col h-full min-w-fit sm:min-w-0 mx-5">
        <div class="md:gap-4 text-left border-b">
            <div class="inline-flex">
                <div class="my-auto mr-2">
                    <SearchBar class="simple" @search="onSearch" />
                </div>
                <button
                    v-if="!global.state.queryInProgress"
                    class="py-2 px-4 justify-self-start 2xl:ml-6 my-auto bg-slate-100 hover:bg-slate-300 text-slate-600 font-medium rounded"
                    data-cy="advanced-search-results"
                    @click="showAdvancedSearch = true"
                >
                    {{ $t('message.advanced') }}
                </button>
            </div>
            <div
                v-if="!global.state.queryInProgress && !$route.query.q"
                class="text-sm mb-2"
            >
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p v-html="$t('message.results_by_advanced_search')"></p>
            </div>
            <div class="md:flex items-center mb-3 justify-between">
                <div
                    v-if="global.state.responseTotal > 0"
                    class="md:flex md:justify-center items-center mb-3 md:mb-0 mr-5"
                >
                    <!-- eslint-disable vue/no-v-html -->
                    <span
                        class="my-2"
                        v-html="
                            $t('message.found_activities', {
                                count: formatNumber(global.state.responseTotal),
                            })
                        "
                    ></span>
                    <!-- eslint-enable vue/no-v-html -->
                </div>
                <div class="sm:inline-flex">
                    <div
                        v-if="global.state.responseTotal > 0"
                        class="flex ml-0 md:mx-1 justify-left items-center"
                    >
                        <SortButtons
                            v-if="
                                global.state.responseTotal != null &&
                                global.state.responseTotal > 0
                            "
                            class="max-w-full sm:mb-0"
                        />
                    </div>
                    <div
                        v-if="global.state.responseTotal > 0"
                        class="flex justify-left items-center mt-2 sm:m-1"
                    >
                        <DownloadButtons />
                    </div>
                </div>
            </div>
        </div>
        <ResultList />
    </div>
</template>
