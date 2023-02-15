<script setup>
const props = defineProps({
    variant: { type: String, default: 'yellow' },
    size: { type: String, default: 'base' },
    ariaLabel: { type: String, default: '' },
});
const emits = defineEmits(['click']);

const classes = {
    'bg-btn-green': props.variant === 'green',
    'bg-btn-red': props.variant === 'red',
    'bg-btn-yellow': props.variant === 'yellow',
    'text-xs h-8': props.size === 'sm',
};
</script>

<template>
    <button
        :aria-label="props.ariaLabel"
        class="hover:bg-iati-grey text-white py-1.5 px-5 rounded"
        :class="classes"
        @click="emits('click')"
    >
        <span class="p-[2px] inline-flex align-middle"><slot /></span>
    </button>
</template>
