<script setup>
import { ref } from 'vue';
import AppButton from '../components/AppButton.vue';
import { QuestionMarkCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid';

defineProps({ deletable: { type: Boolean, default: true } });
const emits = defineEmits(['addRule', 'addGroup', 'toggleOperator', 'delete']);

const operator = ref('AND');
const toggleOperator = () => {
    operator.value = operator.value === 'AND' ? 'OR' : 'AND';
    emits('toggleOperator', operator.value);
};
const buttonClasses =
    'h-8 text-xs px-2 py-1 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out';
</script>

<template>
    <div class="mr-3 mb-1 text-center flex">
        <div class="py-1">
            <span class="mr-3 text-sm">Group Operator</span>
            <button
                :class="[operator === 'AND' ? 'bg-blue-300' : '', buttonClasses]"
                class="border-l border-t border-b rounded-l"
                type="button"
                @click="toggleOperator"
            >
                {{ $t('message.and') }}
            </button>
            <button
                :class="[operator === 'OR' ? 'bg-blue-300' : '', buttonClasses]"
                type="button"
                class="border-r border-t border-b rounded-r"
                @click="toggleOperator"
            >
                {{ $t('message.or') }}
            </button>
        </div>
        <button type="button" class="p-2 block has-tooltip">
            <QuestionMarkCircleIcon class="h-6 cursor-pointer" />
            <span
                role="definition"
                class="tooltip border rounded text-white p-2 ml-9 -mt-8 bg-iati-grey"
            >
                The selected operator is used to join all elements within the group
            </span>
        </button>

        <div v-if="deletable" class="p-2 float-right">
            <XCircleIcon class="h-6 cursor-pointer" @click="emits('delete')" />
        </div>
    </div>
    <div class="inline-flex items-center w-full" role="toolbar">
        <AppButton variant="outline" size="sm" class="mr-2 px-[8px]" @click="emits('addRule')">
            <span class="uppercase">Add Rule</span>
        </AppButton>
        <AppButton variant="outline-accent" class="px-[8px]" size="sm" @click="emits('addGroup')">
            <span class="uppercase">Add Group</span>
        </AppButton>
    </div>
</template>
