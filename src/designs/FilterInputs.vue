<script setup>
import { v4 as uuidv4 } from 'uuid';
import { inject, reactive, watch } from 'vue';
import FilterGroup from './FilterGroup.vue';

defineProps({ filters: { type: Array, default: () => [] } });
const emits = defineEmits(['update']);

const global = inject('global');

const group = reactive({ id: uuidv4(), type: 'group', operator: 'AND', items: [] });

watch(group, () => {
    emits('update', group);
});

const onAddRule = () => {
    const items = group.items.concat({
        id: uuidv4(),
        type: null,
        field: null,
        value: null,
        operator: 'equals',
        joinOperator: 'AND',
    });
    group.items = items;
};
const onAddGroup = () => {
    const items = group.items.concat({
        id: uuidv4(),
        type: 'group',
        operator: 'AND',
        items: [],
    });
    group.items = items;
};
const onToggleOperator = (group, operator) => {
    group.operator = operator;
};
</script>

<template>
    <div class="text-left">
        <FilterGroup
            v-if="global.state.filters.length"
            :group="group"
            :deletable="false"
            @add-rule="onAddRule"
            @add-group="onAddGroup"
            @toggle-operator="onToggleOperator"
        />
    </div>
</template>
