<script setup>
import { v4 as uuidv4 } from 'uuid';
import { inject, reactive, watch } from 'vue';
import FilterGroup from './FilterGroup.vue';
import SideBarButtons from './SideBarButtons.vue';

defineProps({
    filters: { type: Array, default: () => [] },
});

const global = inject('global');

let group = reactive({ id: uuidv4(), type: 'group', operator: 'AND', items: [] });

// alternative value for variant is "closing"
const getBracketFilter = (variant = 'opening', joinOperator = 'AND') => {
    return {
        id: uuidv4(),
        type: 'grouping',
        field: '()',
        value: variant === 'opening' ? '(' : ')',
        operator: 'equals',
        joinOperator,
    };
};
const getFiltersFromGroup = (group, parentGroupOperator) => {
    return [getBracketFilter('opening', parentGroupOperator || group.operator)].concat(
        group.items.reduce((filters, item) => {
            if (item.type === 'group') {
                return filters.concat(getFiltersFromGroup(item, group.operator));
            }
            item.joinOperator = group.operator;
            return filters.concat(item);
        }, []),
        getBracketFilter('closing', group.operator)
    );
};

watch(group, () => {
    global.setFilters(getFiltersFromGroup(group));
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
const validateGroup = (grup) => {
    let isValid = true;
    grup.items = grup.items.map((item) => {
        if (item.type === 'group') {
            const [valid, _group] = validateGroup(item);

            isValid = valid;
            return _group;
        }
        const [errorCount, filter] = global.validateFilter(item);
        isValid = !errorCount;

        return filter;
    });

    return [isValid, grup];
};
const onRun = () => {
    const [isValid] = validateGroup(group);
    if (isValid) {
        global.run();
    }
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

    <SideBarButtons class="mt-5" @run="onRun" />
</template>
