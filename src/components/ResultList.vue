<script setup>
import VPagination from '@hennge/vue3-pagination';
import '@hennge/vue3-pagination/dist/vue3-pagination.css';
import LoadingSpinner from '../components/LoadingSpinner.vue';

let page = 1;
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="flex items-center justify-center">
            <LoadingSpinner v-if="global.state.queryInProgress === true" />
        </div>
        <div
            v-if="global.state.responseTotal > 0 && $route.matched[0].path === '/advanced'"
            class="grid grid-cols-4 gap-2 text-left py-3 border"
        >
            <div class="col-span-4">
                <div class="flex items-center justify-center mt-1">
                    <!-- eslint-disable vue/no-v-html -->
                    <span
                        class="my-2"
                        v-html="
                            $t('message.found_matching_iati_activities', {
                                count: global.state.responseTotal,
                            })
                        "
                    ></span>
                    <!-- eslint-enable vue/no-v-html -->
                </div>
            </div>
            <div class="flex items-center justify-center col-span-4">
                <SortButtons class="mr-4" />
                <DownloadButtons v-if="global.state.responseDocs" />
            </div>
        </div>

        <div class="flex-grow">
            <router-view />
            <ul
                v-if="global.state.responseTotal != null && global.state.responseTotal > 0"
                id="results"
                class="mx-5 my-5"
            >
                <li v-for="doc in global.state.responseDocs" :key="doc.id">
                    <ResultItem :doc="doc" />
                </li>
            </ul>

            <p
                v-if="global.state.responseTotal === 0 && global.state.responseErrorMessage === ''"
                class="mt-10"
            >
                {{ $t('message.no_match') }}
            </p>
            <p
                v-if="global.state.responseTotal === 0 && global.state.responseErrorMessage !== ''"
                class="mt-10"
            >
                {{ global.state.responseErrorMessage }}
            </p>
        </div>
        <div class="border-solid border-t p-2 flex">
            <v-pagination
                v-model="page"
                class="flex flex-auto justify-center"
                :pages="global.state.numberPages"
                :range-size="global.state.resultsPerPage"
                active-color="#155366"
                @update:model-value="global.paginationUpdate"
            />
        </div>
    </div>
</template>

<script>
import ResultItem from './ResultItem.vue';
import DownloadButtons from './DownloadButtons.vue';
import SortButtons from './SortButtons.vue';
export default {
    name: 'ResultList',
    components: {
        DownloadButtons,
        ResultItem,
        VPagination,
        SortButtons,
    },
    inject: ['global'],
};
</script>

<style>
/* override the pagination component CSS */
.Control {
    position: relative;
    display: block;
    width: 25px;
    height: 25px;
    margin: 0 3px;
    fill: #0369a1;
}
.Control-active {
    fill: #0369a1;
    cursor: pointer;
    transition: fill 0.2s ease-in-out;
}
.Control-active:hover {
    fill: #000000;
    transition: fill 0.2s ease-in-out;
}

.Page {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 15px;
    margin: 0 3px;
    color: #0369a1;
    background-color: transparent;
    border: 1px solid #dedede;
    border-radius: 3px;
    box-sizing: border-box;
    border-color: transparent;
    cursor: pointer;
    outline: 0;
    user-select: none;
}
.Page:hover {
    border: 1px solid #dedede;
}
.Page-active {
    color: #ffffff;
    border: 1px solid #dedede;
}
</style>
