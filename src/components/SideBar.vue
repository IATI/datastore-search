<script setup>
import { inject, computed, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import FilterInputs from './FilterInputs.vue';
import ExportModal from './ExportModal.vue';
import ImportModal from './ImportModal.vue';
import BboxModal from './BboxModal.vue';
import FilterString from './FilterString.vue';
import LoadingSpinner from './LoadingSpinner.vue';

const global = inject('global');
const route = useRoute();
const query = computed(() => route.query.q);
const fileImport = reactive({ loading: false, file: null, version: null });

watch(
    () => global.state.import.fileLoading,
    () => {
        const { fileLoading, file } = global.state.import;
        fileImport.loading = !!fileLoading;
        fileImport.file = file;
        fileImport.version = file.version ? Number(file.version) : null;
    }
);
</script>

<template>
    <div class="sticky top-0 h-full">
        <div class="h-full max-h-screen overflow-y-auto">
            <div
                v-if="fileImport.loading"
                class="absolute w-full h-full bg-slate-400 z-10 opacity-90"
            >
                <LoadingSpinner class="w-full m-auto" />
            </div>
            <div id="filters" class="mx-3 my-5">
                <FilterInputs
                    v-if="!fileImport.file || fileImport.version >= 2"
                    :filters="global.state.filters"
                    :query="query"
                />
                <FilterString v-else :filters="global.state.filters" />
            </div>
        </div>
    </div>
    <teleport to="#modals">
        <ExportModal />
        <ImportModal />
        <BboxModal />
    </teleport>
</template>
