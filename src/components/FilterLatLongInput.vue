<script setup>
import { inject, watch } from 'vue';

const props = defineProps({ filter: { type: Object, default: () => {} } });
const emits = defineEmits(['change']);
const global = inject('global');

watch(global.state.bbox, () => {
    if (global.state.bbox.filterId === props.filter.id) {
        const {
            southWestLat,
            southWestLon,
            displayPrecision,
            northEastLat,
            northEastLon,
        } = global.state.bbox;
        if (southWestLat && southWestLon && northEastLat && northEastLon) {
            const value = `[${southWestLat.toFixed(displayPrecision)},${southWestLon.toFixed(
                displayPrecision,
            )} TO ${northEastLat.toFixed(displayPrecision)},${northEastLon.toFixed(
                displayPrecision,
            )}]`;

            emits('change', value);
        }
    }
});
</script>
<template>
    <div class="grid grid-cols-8 gap-2">
        <div class="col-span-5">
            <div class="flex items-center justify-center">
                <input
                    type="text"
                    disabled="true"
                    :class="{ 'border-red-400': filter.valid === false }"
                    class="h-10 mb-2 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                    :placeholder="$t('message.latlon_placeholder')"
                    :value="filter.value"
                />
            </div>
        </div>
        <div class="col-span-3">
            <div class="inline-flex" role="toolbar">
                <button
                    type="button"
                    class="bg-blue-300 hover:bg-iati-grey text-white font-bold py-2 px-2 rounded float-right"
                    @click="global.toggleBboxModal(filter.id)"
                >
                    {{ $t('message.use_map') }}
                </button>
            </div>
        </div>
    </div>
</template>
