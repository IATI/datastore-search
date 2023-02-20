<script setup>
import { computed, inject } from 'vue';

defineProps({ filter: { type: Object, default: () => {} } });

const minNumber = computed(() => {
    if (this.$props.filter.field.includes('_percentage')) {
        return 0;
    }
    return null;
});

const maxNumber = computed(() => {
    if (this.$props.filter.field.includes('_percentage')) {
        return 100;
    }
    return null;
});

const global = inject('global');
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
                        @click="global.changeFilter(filter.id, 'operator', 'lessThan')"
                    >
                        &#60;
                    </button>
                    <button
                        :class="{
                            'bg-blue-300': filter.operator === 'equals',
                        }"
                        type="button"
                        class="h-10 border px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                        @click="global.changeFilter(filter.id, 'operator', 'equals')"
                    >
                        =
                    </button>
                    <button
                        :class="{
                            'bg-blue-300': filter.operator === 'greaterThan',
                        }"
                        type="button"
                        class="h-10 border-r border-t border-b rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                        @click="global.changeFilter(filter.id, 'operator', 'greaterThan')"
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
                @input="global.changeFilter(filter.id, 'value', Number($event.target.value))"
            />
        </div>
    </div>
</template>
