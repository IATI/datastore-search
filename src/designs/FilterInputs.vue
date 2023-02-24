<script setup>
import { inject, reactive, watch } from 'vue';
import FilterGroup from './FilterGroup.vue';

defineProps({ filters: { type: Array, default: () => [] } });

const global = inject('global');

const group = reactive({ id: 'group-0', type: 'group', operator: 'AND', items: [] });

const onAddRule = () => {
    const items = group.items.concat({
        id: `${group.id}-item-${group.items.length + 1}`,
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
        id: `${group.id}-item-${group.items.length + 1}`,
        type: 'group',
        operator: 'AND',
        items: [],
    });
    group.items = items;
};
const onToggleOperator = (group, operator) => {
    group.operator = operator;
};
watch(group, () => {
    console.log(group);
});
</script>

<template>
    <div class="text-left">
        <FilterGroup
            v-if="global.state.filters.length"
            :group="group"
            @add-rule="onAddRule"
            @add-group="onAddGroup"
            @toggle-operator="onToggleOperator"
        />
    </div>
</template>
