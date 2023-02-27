<script setup>
import { inject } from 'vue';

const global = inject('global');
</script>

<template>
    <div class="sticky top-0 h-full">
        <div class="h-full max-h-screen overflow-y-auto">
            <div id="filters" class="mx-3 my-5">
                <FilterInputs :filters="global.state.filters" />
            </div>
        </div>
    </div>
    <teleport to="#modals">
        <ExportModal />
        <ImportModal />
        <BboxModal />
    </teleport>
</template>

<script>
import FilterInputs from './FilterInputs.vue';
import ExportModal from './ExportModal.vue';
import ImportModal from './ImportModal.vue';
import BboxModal from './BboxModal.vue';
export default {
    name: 'SideBar',
    components: {
        FilterInputs,
        ExportModal,
        ImportModal,
        BboxModal,
    },
    inject: ['global'],
};
</script>
