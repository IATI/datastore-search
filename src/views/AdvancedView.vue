<!-- This view is deprecated TODO: remove in future version -->
<script setup>
import Split from 'split.js';
import { inject, onMounted, onUnmounted } from 'vue';
import SideBar from '../components/SideBar.vue';
import ResultList from '../components/ResultList.vue';

const global = inject('global');

onMounted(() => {
    Split(['#split-0', '#split-1'], {
        sizes: [40, 60],
        minSize: 500,
        expandToMin: true,
        gutterAlign: 'start',
    });
});

onUnmounted(() => {
    global.resetResults();
});
</script>
<template>
    <div class="h-full">
        <div class="mx-6 pt-6 advanced:hidden">
            <p class="text-orange-600 text-left">
                {{ $t('message.advanced_unavailable_para1') }}
            </p>
            <!-- eslint-disable vue/no-v-html -->
            <p
                class="pt-6 text-left"
                v-html="$t('message.advanced_unavailable_para2')"
            ></p>
            <!-- eslint-enable vue/no-v-html -->
        </div>
        <div class="h-full split invisible advanced:visible">
            <div id="split-0"><SideBar /></div>
            <div id="split-1"><ResultList /></div>
        </div>
    </div>
</template>

<style>
.split {
    display: flex;
    flex-direction: row;
}

.gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
</style>
