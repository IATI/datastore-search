<script setup>
import FilterGroupActions from './FilterGroupActions.vue';
import FilterGroupItem from './FilterGroupItem.vue';

defineProps({ group: { type: Object, default: () => {} } });
const emit = defineEmits(['addRule', 'addGroup']);

const onAddRule = (group) => {
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
const onAddGroup = (group) => {
    const items = group.items.concat({ type: 'group', operator: 'AND', items: [] });
    group.items = items;
};
const onUpdateFilter = (event) => {
    console.log(event.target.value);
};
</script>

<template>
    <div class="p-2 border">
        <FilterGroupActions
            @add-rule="emit('addRule', group)"
            @add-group="emit('addGroup', group)"
        />
        <div v-for="item in group.items" :key="item.id">
            <div v-if="item.type !== 'group'">
                <FilterGroupItem :key="item.id" :filter="item" @change="onUpdateFilter" />
            </div>
            <div v-else class="mt-3">
                <FilterGroup :group="item" @add-rule="onAddRule" @add-group="onAddGroup" />
            </div>
        </div>
    </div>
</template>
