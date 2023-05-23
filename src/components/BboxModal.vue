<template>
    <div
        v-if="global.state.bbox.showModal"
        role="dialog"
        class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
    >
        <div class="max-w p-6 bg-white divide-y divide-gray-500 rounded">
            <h2 class="text-2xl">{{ $t('message.pan_and_zoom') }}</h2>
            <p v-if="global.state.bbox.southWestLat !== null">
                {{ global.state.bbox.southWestLat.toFixed(global.state.bbox.displayPrecision) }},
                {{ global.state.bbox.southWestLon.toFixed(global.state.bbox.displayPrecision) }} TO
                {{ global.state.bbox.northEastLat.toFixed(global.state.bbox.displayPrecision) }},
                {{ global.state.bbox.northEastLon.toFixed(global.state.bbox.displayPrecision) }}
            </p>

            <div class="mt-1">
                <SmallMap />
                <div class="flex justify-between">
                    <button
                        class="px-4 py-2 text-white font-bold bg-iati-grey hover:bg-iati-blue rounded"
                        @click="global.toggleBboxModal()"
                    >
                        {{ $t('message.cancel') }}
                    </button>
                    <button
                        :disabled="global.state.bbox.southWestLat === null"
                        :class="{
                            'opacity-25 cursor-not-allowed':
                                global.state.bbox.southWestLat === null,
                        }"
                        class="px-4 py-2 text-white font-bold bg-iati-grey hover:bg-iati-blue rounded flex justify-between"
                        @click="global.applyBbox()"
                    >
                        <span>{{ $t('message.apply') }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SmallMap from '../components/SmallMap.vue';

export default {
    name: 'BboxModal',
    components: {
        SmallMap,
    },
    inject: ['global'],
};
</script>
