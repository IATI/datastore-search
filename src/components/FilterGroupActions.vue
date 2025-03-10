<script setup>
import { QuestionMarkCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid';
import AppButton from '../components/AppButton.vue';

const props = defineProps({
    deletable: { type: Boolean, default: true },
    group: { type: Object, default: () => {} },
});

const emits = defineEmits(['addRule', 'addGroup', 'toggleOperator', 'delete']);

const buttonClasses =
    'h-8 text-xs px-2 py-1 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out';
</script>

<template>
    <div class="mr-3 mb-1 text-center flex">
        <div class="py-1">
            <span class="mr-3 text-sm">{{ $t('message.group_operator') }}</span>
            <button
                :class="[
                    group.operator === 'AND' ? 'bg-blue-300' : '',
                    buttonClasses,
                ]"
                class="border-l border-t border-b rounded-l"
                type="button"
                data-cy="group-and"
                @click="emits('toggleOperator', props.group.id, 'AND')"
            >
                {{ $t('message.and') }}
            </button>
            <button
                :class="[
                    group.operator === 'OR' ? 'bg-blue-300' : '',
                    buttonClasses,
                ]"
                type="button"
                class="border-r border-t border-b rounded-r"
                data-cy="group-or"
                @click="emits('toggleOperator', props.group.id, 'OR')"
            >
                {{ $t('message.or') }}
            </button>
        </div>
        <button
            type="button"
            class="m-2 block"
            data-tooltip="The selected operator is used to join all elements within the group"
            data-position="bottom right"
            data-size="sm"
        >
            <QuestionMarkCircleIcon class="h-6 cursor-pointer" />
        </button>

        <div v-if="deletable" class="p-2 float-right">
            <span
                data-cy="remove-group"
                @click="emits('delete', props.group.id)"
            >
                <XCircleIcon class="h-6 cursor-pointer" />
            </span>
        </div>
    </div>
    <div class="inline-flex items-center w-full" role="toolbar">
        <AppButton
            variant="outline"
            size="sm"
            class="mr-2 px-[8px]"
            data-cy="add-rule"
            @click="emits('addRule', props.group.id)"
        >
            <span class="uppercase">{{ $t('message.add_rule') }}</span>
        </AppButton>
        <AppButton
            variant="outline-accent"
            class="px-[8px]"
            size="sm"
            data-cy="add-group"
            @click="emits('addGroup', props.group.id)"
        >
            <span class="uppercase">{{ $t('message.add_group') }}</span>
        </AppButton>
    </div>
</template>
