<script setup>
import SideBarButtons from '../components/SideBarButtons.vue';
</script>

<template>
    <div class="sticky top-0 h-full">
        <div class="h-full max-h-screen overflow-y-auto">
            <ul id="filters" class="mx-5 my-5">
                <li v-for="filter in global.state.filters" :key="filter.id">
                    <FilterInputs :filter="filter" />
                </li>
            </ul>
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
