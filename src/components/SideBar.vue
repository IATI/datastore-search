<script setup>
import { inject, onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import FilterInputs from './FilterInputs.vue';
import ExportModal from './ExportModal.vue';
import ImportModal from './ImportModal.vue';
import BboxModal from './BboxModal.vue';

const global = inject('global');
const showAdvancedSearch = inject('showAdvancedSearch');
const defaultQuery = ref(null);
const route = useRoute();

watch(showAdvancedSearch, () => {
    if (showAdvancedSearch && route.query.q) {
        defaultQuery.value = route.query.q;
    }
});

onBeforeMount(() => {
    global.addFilter();
});
</script>

<template>
    <div class="sticky top-0 h-full">
        <div class="h-full max-h-screen overflow-y-auto">
            <div id="filters" class="mx-3 my-5">
                <FilterInputs :filters="global.state.filters" :default-query="defaultQuery" />
            </div>
        </div>
    </div>
    <teleport to="#modals">
        <ExportModal />
        <ImportModal />
        <BboxModal />
    </teleport>
</template>
