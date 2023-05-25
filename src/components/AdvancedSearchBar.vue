<script setup>
import { inject } from 'vue';
import SideBar from '../components/SideBar.vue';
defineProps({ show: Boolean });

const showAdvancedSearch = inject('showAdvancedSearch');
</script>

<template>
    <div
        class="search-bar--wrapper"
        :class="{ '!block': show }"
        @click.stop="showAdvancedSearch = false"
    >
        <div class="search-bar--menu" :class="{ show }" @click.stop>
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
    left: 360px;
    top: 0;
    width: 560px;
    transition: transform 0.3s;
}

.search-bar .search-bar--menu.show {
    transform: translateX(-360px);
}
</style>
