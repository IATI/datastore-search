<script setup>
import { v4 as uuidv4 } from 'uuid';
import { inject } from 'vue';
import SideBarButtons from './SideBarButtons.vue';

const global = inject('global');

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

const onUpdateFilter = (group) => {
    global.setFilters(getFiltersFromGroup(group));
};
</script>

<template>
    <div class="sticky top-0 h-full">
        <div class="h-full max-h-screen overflow-y-auto">
            <div id="filters" class="mx-3 my-5">
                <FilterInputs :filters="global.state.filters" @update="onUpdateFilter" />
            </div>
            <SideBarButtons />
        </div>
    </div>
    <teleport to="#modals">
        <ExportModal />
        <ImportModal />
        <BboxModal />
    </teleport>
</template>

<script>
import FilterInputs from './FilterInputs.vue';
import ExportModal from './ExportModal.vue';
import ImportModal from './ImportModal.vue';
import BboxModal from './BboxModal.vue';
export default {
    name: 'SideBar',
    components: {
        FilterInputs,
        ExportModal,
        ImportModal,
        BboxModal,
    },
    inject: ['global'],
};
</script>
