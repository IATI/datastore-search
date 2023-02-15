<script setup>
const props = defineProps({
    variant: { type: String, default: 'yellow' },
    ariaLabel: { type: String, default: '' },
});
const emits = defineEmits(['click']);

const classes = {
    'bg-btn-green': props.variant === 'green',
    'bg-btn-red': props.variant === 'red',
    'bg-btn-yellow': props.variant === 'yellow',
};
</script>

<template>
    <button
        :aria-label="props.ariaLabel"
        class="hover:bg-iati-grey text-white py-1.5 px-5 rounded inline-flex"
        :class="classes"
        @click="emits('click')"
    >
        <slot />
    </button>
</template>
