<script setup>
import FilterGroupActions from './FilterGroupActions.vue';
import FilterGroupItem from './FilterGroupItem.vue';

const props = defineProps({ filter: { type: Object, default: () => {} } });

const onAddRule = () => {
    console.log('Adding Rule');
};
const onAddGroup = () => {
    console.log('Adding Group');
};
</script>

<template>
    <div class="p-2 border">
        <FilterGroupActions @add-rule="onAddRule" @add-group="onAddGroup" />
        <FilterGroupItem :filter="props.filter" />
    </div>
</template>
