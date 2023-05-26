<script setup>
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { inject, ref, watch } from 'vue';
import SideBar from '../components/SideBar.vue';

const showAdvancedSearch = inject('showAdvancedSearch');
const show = ref(false);

watch(showAdvancedSearch, () => {
    if (showAdvancedSearch.value) {
        setTimeout(() => {
            show.value = true;
        }, 10);
    } else if (show.value) {
        show.value = false;
    }
});
const onClose = () => {
    show.value = false;
    setTimeout(() => {
        showAdvancedSearch.value = false;
    }, 310);
};
</script>

<template>
    <div
        class="search-bar--wrapper"
        :class="{ '!block': showAdvancedSearch }"
        @click.stop="onClose"
    >
        <div class="search-bar--menu" :class="{ show }" @click.stop>
            <div class="p-4 text-left flex justify-between items-center">
                <h1 class="text-3xl font-semibold">{{ $t('message.advanced_search') }}</h1>
                <XMarkIcon class="h-25 w-10 text-grey-300 mr-1 cursor-pointer" @click="onClose" />
            </div>
            <SideBar />
        </div>
    </div>
</template>

<style>
.search-bar {
    background: #fff;
    position: relative;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

.search-bar--wrapper {
    background: rgba(32, 33, 36, 0.6);
    bottom: 0;
    display: none;
    left: 0;
    overflow: hidden;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 2;
}

.search-bar--menu {
    background: #fff;
    border-bottom: 1px solid #dadce0;
    bottom: 0;
    overflow-y: auto;
    position: fixed;
    right: -50%;
    top: 0;
    width: 50%;
    transition: transform 0.3s;
}

.search-bar .search-bar--menu.show {
    transform: translateX(-100%);
}
</style>
