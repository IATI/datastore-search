<script setup>
import { ref, provide } from 'vue';

const show = ref(false);
provide('showTooltip', show);
</script>

<template>
    <div
        class="has-tooltip"
        @mouseenter="show = true"
        @mouseleave="show = false"
    >
        <slot name="trigger" />
        <slot />
    </div>
</template>
