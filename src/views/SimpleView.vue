<script setup>
import { inject, onBeforeUnmount } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import ResultList from '../components/ResultList.vue';
import DownloadButtons from '../components/DownloadButtons.vue';
import SortButtons from '../components/SortButtons.vue';

const global = inject('global');
const showAdvancedSearch = inject('showAdvancedSearch');

onBeforeUnmount(() => {
    sessionStorage.removeItem('searchterm');
});

const goToAdvanced = () => {
    // global.importSimpleSearchToAdv();
    showAdvancedSearch.value = true;
};
</script>

<template>
    <div class="flex flex-col h-full min-w-fit sm:min-w-0">
        <div class="px-2 md:grid md:grid-cols-11 lg:grid-cols-12 md:gap-4 text-left border-b">
            <div class="col-span-1 hidden 2xl:block"></div>
            <div class="my-auto col-span-3 md:col-span-4 lg:col-span-3 2xl:col-span-2 ml-2">
                <SearchBar class="simple" />
            </div>
            <button
                v-if="global.state.responseTotal > 0"
                class="hidden lg:block col-span-2 xl:col-span-1 p-2 justify-self-start 2xl:ml-6 my-auto bg-iati-blue hover:bg-iati-grey text-white font-bold rounded"
                @click="goToAdvanced"
            >
                {{ $t('message.advanced') }}
            </button>
            <div
                v-if="global.state.responseTotal > 0"
                class="flex col-span-1 xl:col-span-2 justify-center items-center"
            >
                <!-- eslint-disable vue/no-v-html -->
                <span
                    class="my-2"
                    v-html="
                        $t('message.found_activities', {
                            count: global.state.responseTotal,
                        })
                    "
                ></span>
                <!-- eslint-enable vue/no-v-html -->
            </div>
            <div
                v-if="global.state.responseTotal > 0"
                class="flex col-span-2 md:col-span-3 m-1 justify-left items-center"
            >
                <SortButtons
                    v-if="global.state.responseTotal != null && global.state.responseTotal > 0"
                />
            </div>
            <div
                v-if="global.state.responseTotal > 0"
                class="flex col-span-3 justify-left items-center m-1"
            >
                <DownloadButtons />
            </div>
        </div>
        <ResultList />
    </div>
</template>
