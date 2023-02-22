<script setup>
import { inject, ref } from 'vue';
import FilterGroup from './FilterGroup.vue';

defineProps({ filters: { type: Array, default: () => [] } });

const global = inject('global');

const group = ref({ type: 'group', operator: 'AND', items: [] });

const onAddRule = () => {
    const items = group.value.items.concat({
        id: `filter-${group.value.items.length + 1}`,
        type: null,
        field: null,
        value: null,
        operator: 'equals',
        joinOperator: 'AND',
    });
    group.value.items = items;
};
const onAddGroup = () => {
    const items = group.value.items.concat({ type: 'group', operator: 'AND', items: [] });
    group.value.items = items;
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
