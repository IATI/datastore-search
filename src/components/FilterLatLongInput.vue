<script setup>
import { inject } from 'vue';

const props = defineProps({ filter: { type: Object, default: () => {} } });
const global = inject('global');
</script>
<template>
    <div class="grid grid-cols-8 gap-2">
        <div class="col-span-5">
            <div class="flex items-center justify-center">
                <input
                    type="text"
                    disabled="true"
                    :class="{ 'border-red-400': props.filter.valid === false }"
                    class="h-10 mb-2 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                    :placeholder="$t('message.latlon_placeholder')"
                    :value="props.filter.value"
                    @input="global.changeFilter(props.filter.id, 'value', $event.target.value)"
                />
            </div>
        </div>
        <div class="col-span-3">
            <div class="inline-flex" role="toolbar">
                <button
                    type="button"
                    class="bg-blue-300 hover:bg-iati-grey text-white font-bold py-2 px-2 rounded float-right"
                    @click="global.toggleBboxModal(props.filter.id)"
                >
                    {{ $t('message.use_map') }}
                </button>
            </div>
        </div>
    </div>
</template>
