<script setup>
import { v4 as uuidv4 } from 'uuid';
import { inject, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FilterGroup from './FilterGroup.vue';
import SideBarButtons from './SideBarButtons.vue';

const props = defineProps({
    filters: { type: Array, default: () => [] },
    query: { type: String, default: '' }, // allows for the prepopulation of the narrative field for when a search query exists
});

const global = inject('global');
const route = useRoute();
const router = useRouter();

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

const onAddRule = (group, rule = {}) => {
    const items = group.items.concat({
        id: uuidv4(),
        type: null,
        field: null,
        value: null,
        operator: 'equals',
        joinOperator: 'AND',
        ...rule,
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
        if (route.query.q) {
            router.push({ path: '/' });
            sessionStorage.removeItem('searchterm');
        }
        global.setFilters(getFiltersFromGroup(group));
        global.run();
    }
};

const getGroupFromFilters = (filters, startIndex = 0) => {
    let nextIndex = startIndex;
    const group = { id: uuidv4(), type: 'group', operator: 'AND', items: [] };
    filters.forEach((item, index) => {
        if (index === nextIndex) {
            if (item.type === 'grouping') {
                if (item.value === '(') {
                    const { group: nestedGroup, index: nestedIndex } = getGroupFromFilters(
                        filters,
                        index + 1
                    );
                    group.items.push(nestedGroup);
                    nextIndex = nestedIndex + 1;
                } else if (item.value === ')') {
                    nextIndex = index;
                }
            } else {
                group.operator = item.joinOperator;
                onAddRule(group, item);
                nextIndex = index + 1;
            }
        }
    });

    return { group, index: nextIndex };
};

watch(
    () => props.filters,
    () => {
        const result = getGroupFromFilters(props.filters);
        group = result.group;
    }
);
</script>

<template>
    <div class="text-left">
        <FilterGroup
            v-if="filters.length"
            :group="group"
            :deletable="false"
            @add-rule="onAddRule"
            @add-group="onAddGroup"
            @toggle-operator="onToggleOperator"
        />
    </div>

    <SideBarButtons class="mt-5" @run="onRun" />
</template>
