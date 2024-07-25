<script setup>
import FilterGroupActions from './FilterGroupActions.vue';
import FilterGroupItem from './FilterGroupItem.vue';

defineProps({
    group: { type: Object, default: () => {} },
    deletable: { type: Boolean, default: true },
});
const emit = defineEmits(['addRule', 'addGroup', 'toggleOperator', 'delete']);
</script>

<template>
    <div class="p-2 border border-iati-grey">
        <FilterGroupActions
            :deletable="deletable"
            :group="group"
            @add-rule="(groupId) => emit('addRule', groupId)"
            @add-group="(groupId) => emit('addGroup', groupId)"
            @toggle-operator="(groupId, operator) => emit('toggleOperator', groupId, operator)"
            @delete="(groupId) => emit('delete', groupId)"
        />
        <div v-for="item in group.items" :key="item.id">
            <div v-if="item.type !== 'group'">
                <FilterGroupItem :key="item.id" :filter="item" @delete="emit('delete', item.id)" />
            </div>
            <div v-else class="mt-3">
                <FilterGroup
                    :group="item"
                    @add-rule="(itemId) => emit('addRule', itemId)"
                    @add-group="(itemId) => emit('addGroup', itemId)"
                    @toggle-operator="
                        (itemId, operator) => emit('toggleOperator', itemId, operator)
                    "
                    @delete="(itemId) => emit('delete', itemId)"
                />
            </div>
        </div>
    </div>
</template>
