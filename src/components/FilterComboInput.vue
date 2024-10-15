<script setup>
defineProps({ filter: { type: Object, default: () => {} } });
const emits = defineEmits(['changeOperator', 'changeValue']);
</script>
<template>
    <div class="grid grid-cols-8 gap-2">
        <div class="col-span-3">
            <div class="flex items-center justify-center">
                <div class="inline-flex" role="toolbar">
                    <button
                        :class="{
                            'bg-blue-300': filter.operator === 'equals',
                        }"
                        type="button"
                        class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                        @click="emits('changeOperator', 'equals')"
                    >
                        ==
                    </button>
                    <button
                        :class="{
                            'bg-blue-300': filter.operator === 'notEquals',
                        }"
                        type="button"
                        class="h-10 border-r border-t border-b rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                        @click="emits('changeOperator', 'notEquals')"
                    >
                        !=
                    </button>
                </div>
            </div>
        </div>
        <div class="col-span-5">
            <input
                type="text"
                :placeholder="
                    $t('message.select_from_codes', {
                        name: filter.selectedOption.codelistMeta.name,
                    })
                "
                :list="'datalist' + filter.id"
                class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                :class="{ 'border-red-400': filter.valid === false }"
                :value="filter.value"
                @change="emits('changeValue', $event)"
            />
            <datalist :id="'datalist' + filter.id">
                <option
                    v-for="valueOption in filter.selectedOption.options"
                    :key="valueOption.code"
                    :value="valueOption.code"
                >
                    {{
                        valueOption.code +
                        (valueOption.name ? ' - ' + valueOption.name : null)
                    }}
                </option>
            </datalist>
        </div>
    </div>
</template>
