<script setup>
import { v4 as uuidv4 } from 'uuid';
import FilterGroupActions from './FilterGroupActions.vue';
import FilterGroupItem from './FilterGroupItem.vue';

defineProps({
    group: { type: Object, default: () => {} },
    deletable: { type: Boolean, default: true },
});
const emit = defineEmits(['addRule', 'addGroup', 'toggleOperator', 'delete']);

const onAddRule = (group) => {
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
const onAddGroup = (group) => {
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
const onDeleteItem = (group, itemId) => {
    group.items = group.items.filter((item) => item.id !== itemId);
};
</script>

<template>
    <div class="p-2 border border-iati-grey">
        <FilterGroupActions
            :deletable="deletable"
            @add-rule="emit('addRule', group)"
            @add-group="emit('addGroup', group)"
            @toggle-operator="(operator) => emit('toggleOperator', group, operator)"
            @delete="emit('delete', group)"
        />
        <div v-for="item in group.items" :key="item.id">
            <div v-if="item.type !== 'group'">
                <FilterGroupItem
                    :key="item.id"
                    :filter="item"
                    @delete="onDeleteItem(group, item.id)"
                />
            </div>
            <div v-else class="mt-3">
                <FilterGroup
                    :group="item"
                    @add-rule="onAddRule"
                    @add-group="onAddGroup"
                    @toggle-operator="onToggleOperator"
                    @delete="onDeleteItem(group, item.id)"
                />
            </div>
        </div>
    </div>
</template>
