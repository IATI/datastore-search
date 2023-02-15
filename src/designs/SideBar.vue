<script setup>
import SideBarButtons from './SideBarButtons.vue';
</script>

<template>
    <div class="sticky top-0">
        <div class="h-auto max-h-screen overflow-y-auto">
            <div id="filters" class="mx-3 my-5">
                <div v-for="filter in global.state.filters" :key="filter.id">
                    <FilterInputs :filter="filter" />
                </div>
            </div>
            <SideBarButtons />
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
