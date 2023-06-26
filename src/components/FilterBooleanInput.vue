<script setup>
const props = defineProps({ filter: { type: Object, default: () => {} } });
const emits = defineEmits(['change']);
</script>
<template>
    <div class="inline-flex" role="toolbar">
        <button
            :class="{ 'bg-blue-300': props.filter.value === 'true' }"
            type="button"
            class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
            @click="emits('change', 'true')"
        >
            {{ $t('message.true') }}
        </button>
        <button
            :class="{ 'bg-blue-300': props.filter.value === 'false' }"
            type="button"
            class="h-10 border rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
            @click="emits('change', 'false')"
        >
            {{ $t('message.false') }}
        </button>
    </div>
</template>
