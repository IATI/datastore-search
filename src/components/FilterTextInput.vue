<script setup>
import { inject } from 'vue';

const props = defineProps({ filter: { type: Object, default: () => {} } });

const global = inject('global');
</script>

<template>
    <input
        v-if="global.isFieldType(props.filter.field, 'text')"
        type="text"
        :class="{ 'border-red-400': props.filter.valid === false }"
        class="h-10 mb-2 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        :placeholder="$t('message.search_term')"
        :value="props.filter.value"
        @input="global.changeFilter(props.filter.id, 'value', $event.target.value)"
    />
</template>
