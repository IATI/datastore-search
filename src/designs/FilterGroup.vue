<script setup>
import FilterGroupActions from './FilterGroupActions.vue';

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
    </div>
</template>
