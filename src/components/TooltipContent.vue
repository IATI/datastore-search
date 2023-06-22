<script setup>
import { inject, ref, watch } from 'vue';

const showTooltip = inject('showTooltip');
const tooltip = ref(null);

watch(showTooltip, () => {
    if (showTooltip && tooltip.value) {
        console.log(tooltip.value.getBoundingClientRect());
    }
});
</script>

<template>
    <span
        ref="tooltip"
        role="definition"
        class="tooltip border rounded text-white p-2 -mt-2 bg-iati-grey"
        :class="{ open: showTooltip }"
    >
        <slot />
    </span>
</template>
