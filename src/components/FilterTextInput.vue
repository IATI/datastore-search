<script setup>
defineProps({ filter: { type: Object, default: () => {} } });
const emits = defineEmits(['change']);
</script>

<template>
    <input
        type="text"
        :class="{ 'border-red-400': filter.valid === false }"
        class="h-10 mb-2 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        :placeholder="$t('message.search_term')"
        :value="filter.value"
        @input="(event) => emits('change', event)"
    />
</template>
