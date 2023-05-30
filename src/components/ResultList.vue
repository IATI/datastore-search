<script setup>
import { inject } from 'vue';
import { useRoute } from 'vue-router';
import VPagination from '@hennge/vue3-pagination';
import '@hennge/vue3-pagination/dist/vue3-pagination.css';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ResultListHeader from '../components/ResultListHeader.vue';
import ResultItem from '../components/ResultItem.vue';

const global = inject('global');
const route = useRoute();

let page = 1;
</script>

<template>
    <div class="flex flex-col h-full">
        <ResultListHeader
            v-if="
                (global.state.queryInProgress || global.state.responseTotal > 0) &&
                route.matched[0].path === '/advanced'
            "
            :count="global.state.responseTotal"
            :show-download-buttons="!!global.state.responseDocs"
            :processing="!!global.state.queryInProgress"
        />

        <div class="flex items-center justify-center">
            <LoadingSpinner v-if="global.state.queryInProgress === true" />
        </div>

        <div class="flex-grow">
            <router-view />
            <ul
                v-if="global.state.responseTotal != null && global.state.responseTotal > 0"
                id="results"
                class="my-5"
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
            <VPagination
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
