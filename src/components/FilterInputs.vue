<script setup>
import { v4 as uuidv4 } from 'uuid';
import { inject, reactive, watch, onBeforeMount } from 'vue';
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
        getBracketFilter('closing', group.operator),
    );
};

const onAddRule = (group, groupId, rule = {}) => {
    if (group.id == groupId) {
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
    } else {
        group.items.forEach((item) => {
            if (item.type === 'group') {
                onAddRule(item, groupId);
            }
        });
    }
};
const onAddGroup = (group, groupId) => {
    if (group.id == groupId) {
        const items = group.items.concat({
            id: uuidv4(),
            type: 'group',
            operator: 'AND',
            items: [],
        });
        group.items = items;
    } else {
        group.items.forEach((item) => {
            if (item.type === 'group') {
                onAddGroup(item, groupId);
            }
        });
    }
};
const onToggleOperator = (group, groupId, operator) => {
    if (group.id == groupId) {
        group.operator = operator;
    } else {
        group.items.forEach((item) => {
            if (item.type === 'group') {
                onToggleOperator(item, groupId, operator);
            }
        });
    }
};
const onDeleteItem = (group, itemId) => {
    if (group.items.map((item) => item.id).includes(itemId)) {
        group.items = group.items.filter((item) => item.id !== itemId);
    } else {
        group.items.forEach((item) => {
            if (item.type === 'group') {
                onDeleteItem(item, itemId);
            }
        });
    }
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

const onExport = () => {
    const [isValid] = validateGroup(group);
    if (isValid) {
        global.setFilters(getFiltersFromGroup(group));
        global.toggleExportModal();
    }
};

const populateGroupFromFilters = (filters, group, startIndex = 0) => {
    let nextIndex = startIndex;
    // reset group, but preserve reactivity if available
    group.id = uuidv4();
    group.items = [];

    // populate group from filters
    filters.forEach((item, index) => {
        if (index === nextIndex) {
            if (item.type === 'grouping') {
                if (item.value === '(' && index) {
                    const nestedGroup = {
                        id: uuidv4(),
                        type: 'group',
                        operator: item.joinOperator,
                        items: [],
                    };
                    const { index: nestedIndex } = populateGroupFromFilters(
                        filters,
                        nestedGroup,
                        index + 1,
                    );
                    group.items.push(nestedGroup);
                    nextIndex = nestedIndex + 1;
                } else if (item.value === ')') {
                    nextIndex = index;
                } else {
                    nextIndex++;
                }
            } else {
                group.operator = item.joinOperator;
                onAddRule(group, group.id, item);
                nextIndex = index + 1;
            }
        }
    });

    return { group, index: nextIndex };
};

watch(
    () => props.filters,
    () => {
        populateGroupFromFilters(props.filters, group);
    },
);
onBeforeMount(() => {
    if (props.filters && props.filters.length) {
        populateGroupFromFilters(props.filters, group);
    }
});
</script>

<template>
    <div class="text-left">
        <FilterGroup
            v-if="filters.length"
            :group="group"
            :deletable="false"
            @add-rule="(groupId) => onAddRule(group, groupId)"
            @add-group="(groupId) => onAddGroup(group, groupId)"
            @toggle-operator="(groupId, operator) => onToggleOperator(group, groupId, operator)"
            @delete="(itemId) => onDeleteItem(group, itemId)"
        />
    </div>

    <SideBarButtons class="mt-5" @run="onRun" @export="onExport" />
</template>
