<script setup>
const props = defineProps({
    variant: { type: String, default: 'yellow' },
    size: { type: String, default: 'base' },
    ariaLabel: { type: String, default: '' },
});
const emits = defineEmits(['click']);

const classes = {
    'bg-btn-green text-white': props.variant === 'green',
    'bg-btn-red text-white': props.variant === 'red',
    'bg-btn-yellow text-white': props.variant === 'yellow',
    'border border-iati-grey hover:text-white': props.variant === 'outline',
    'border border-iati-blue hover:text-white':
        props.variant === 'outline-blue',
    'border border-iati-accent hover:text-white':
        props.variant === 'outline-accent',
    'text-xs h-8': props.size === 'sm',
};
</script>

<template>
    <button
        :aria-label="props.ariaLabel"
        class="hover:bg-iati-grey py-1.5 px-5 rounded"
        :class="classes"
        @click="emits('click')"
    >
        <span class="p-[2px] inline-flex align-middle"><slot /></span>
    </button>
</template>
