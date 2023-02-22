<script setup>
import { inject, reactive } from 'vue';
import FilterGroup from './FilterGroup.vue';

defineProps({ filters: { type: Array, default: () => [] } });

const global = inject('global');

const group = reactive({ type: 'group', operator: 'AND', items: [] });

const onAddRule = () => {
    const items = group.items.concat({
        id: `filter-${group.items.length + 1}`,
        type: null,
        field: null,
        value: null,
        operator: 'equals',
        joinOperator: 'AND',
    });
    group.items = items;
};
const onAddGroup = () => {
    const items = group.items.concat({ type: 'group', operator: 'AND', items: [] });
    group.items = items;
};
</script>

<template>
    <div class="text-left">
        <FilterGroup
            v-if="global.state.filters.length"
            :group="group"
            @add-rule="onAddRule"
            @add-group="onAddGroup"
        />
    </div>
</template>
