<script setup>
import FilterGroup from './FilterGroup.vue';
</script>

<template>
    <div class="text-left">
        <FilterGroup :filter="filter" />
    </div>
</template>

<script>
export default {
    name: 'FilterInputs',
    components: { FilterGroup },
    inject: ['global'],
    props: {
        filter: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    computed: {
        minNumber() {
            if (this.$props.filter.field.includes('_percentage')) {
                return 0;
            }
            return null;
        },
        maxNumber() {
            if (this.$props.filter.field.includes('_percentage')) {
                return 100;
            }
            return null;
        },
    },
};
</script>
