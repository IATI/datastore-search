<script setup>
import { inject } from 'vue';
import SideBarButtons from './SideBarButtons.vue';
import FilterStringItem from './FilterStringItem.vue';
import AppAlert from './AppAlert.vue';

defineProps({ filters: { type: Array, default: () => [] } });
const global = inject('global');

const showOperator = (filters, index) => {
    const item = filters[index];
    if (index === filters.length - 1 || (item.type === 'grouping' && item.value === '(')) {
        return false;
    }
    const next = index === filters.length - 1 ? null : filters[index + 1];

    if (next.type === 'grouping' && next.value === ')') {
        return false;
    }

    return true;
};
</script>
<template>
    <div>
        <div class="text-left px-2">
            <AppAlert>
                {{ $t('message.incompatible_file_version') }}
            </AppAlert>
            <hr class="pb-4" />
            <div>
                <FilterStringItem
                    v-for="(filter, index) in filters"
                    :key="filter.id"
                    :filter="filter"
                    :show-operator="showOperator(filters, index)"
                    operator-position="end"
                />
            </div>
        </div>
        <SideBarButtons class="mt-5" @run="global.run()" />
    </div>
</template>
