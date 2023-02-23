<script setup>
import { computed } from 'vue';

const props = defineProps({ filter: { type: Object, default: () => {} } });
const emits = defineEmits(['changeOperator', 'changeValue']);

const minNumber = computed(() => {
    if (props.filter.field.includes('_percentage')) {
        return 0;
    }
    return null;
});

const maxNumber = computed(() => {
    if (props.filter.field.includes('_percentage')) {
        return 100;
    }
    return null;
});
</script>
<template>
    <div class="grid grid-cols-8 gap-2">
        <div class="col-span-3">
            <div class="flex items-center justify-center">
                <div class="inline-flex" role="toolbar">
                    <button
                        :class="{
                            'bg-blue-300': filter.operator === 'lessThan',
                        }"
                        type="button"
                        class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                        @click="emits('changeOperator', 'lessThan')"
                    >
                        &#60;
                    </button>
                    <button
                        :class="{
                            'bg-blue-300': filter.operator === 'equals',
                        }"
                        type="button"
                        class="h-10 border px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                        @click="emits('changeOperator', 'equals')"
                    >
                        =
                    </button>
                    <button
                        :class="{
                            'bg-blue-300': filter.operator === 'greaterThan',
                        }"
                        type="button"
                        class="h-10 border-r border-t border-b rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                        @click="emits('changeOperator', 'greaterThan')"
                    >
                        &#62;
                    </button>
                </div>
            </div>
        </div>
        <div class="col-span-5">
            <input
                type="number"
                :min="minNumber"
                :max="maxNumber"
                :class="{ 'border-red-400': filter.valid === false }"
                class="h-10 mb-2 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                :value="filter.value"
                @input="emits('changeValue', Number($event.target.value))"
            />
        </div>
    </div>
</template>
