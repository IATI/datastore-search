<script setup>
import { ref } from 'vue';
import FilterGroupActions from './FilterGroupActions.vue';
import FilterGroupItem from './FilterGroupItem.vue';

const props = defineProps({ filter: { type: Object, default: () => {} } });

const ruleCount = ref(0);
const groupCount = ref(0);

const onAddRule = () => {
    ruleCount.value++;
};
const onAddGroup = () => {
    groupCount.value++;
};
</script>

<template>
    <div class="p-2 border">
        <FilterGroupActions @add-rule="onAddRule" @add-group="onAddGroup" />
        <div v-if="ruleCount">
            <FilterGroupItem
                v-for="index in [...Array(ruleCount).keys()]"
                :key="index"
                :filter="props.filter"
            />
        </div>
        <div v-if="groupCount" class="mt-3">
            <FilterGroup :filter="filter" />
        </div>
    </div>
</template>
