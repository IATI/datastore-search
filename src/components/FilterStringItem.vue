<script setup>
defineProps({
    filter: { type: Object, default: null },
    showOperator: { type: Boolean, default: true },
    operatorPosition: { type: String, default: 'start' }, // alternative is "end"
});

const formatOperator = (operator) => {
    switch (operator.toLowerCase()) {
        case 'notequals':
            return 'not equals';
        case 'greaterthan':
            return 'greater than';
        case 'lessthan':
            return 'less than';

        default:
            return operator;
    }
};
</script>

<template>
    <span v-if="filter" class="inline-block">
        <b v-if="showOperator && operatorPosition === 'start'" class="pr-2">
            {{ filter.joinOperator }}
        </b>
        <b v-if="filter.type === 'grouping'" class="pr-2">{{ filter.value }}</b>
        <span v-else-if="filter.selectedOption" class="text-iati-grey pr-2">
            {{ filter.selectedOption.label }}
        </span>
        <span v-else class="text-iati-grey pr-2">{{ filter.field }}</span>
        <span v-if="filter.type !== 'grouping'" class="italic pr-2">
            {{ formatOperator(filter.operator) }}
        </span>
        <span v-if="filter.type !== 'grouping'" class="text-iati-accent pr-2">
            {{ filter.value }}
        </span>
        <b v-if="showOperator && operatorPosition === 'end'" class="pr-2">
            {{ filter.joinOperator }}
        </b>
    </span>
</template>
