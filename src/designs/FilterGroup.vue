<script setup>
import { ref } from 'vue';
import AppButton from '../components/AppButton.vue';
import { XCircleIcon } from '@heroicons/vue/20/solid';

const operator = ref('AND');
const toggleOperator = () => {
    operator.value = operator.value === 'AND' ? 'OR' : 'AND';
};
const buttonClasses =
    'h-8 text-xs px-5 py-1 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out';
</script>

<template>
    <div class="p-2 border">
        <div class="inline-flex items-center w-full" role="toolbar">
            <div class="mr-5">
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
            <AppButton variant="outline" size="sm" class="mr-2">
                <span class="uppercase">Add Rule</span>
            </AppButton>
            <AppButton variant="outline-accent" size="sm">
                <span class="uppercase">Add Group</span>
            </AppButton>
            <div class="p-2 float-right">
                <XCircleIcon class="h-6" />
            </div>
        </div>
    </div>
</template>
