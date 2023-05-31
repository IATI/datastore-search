<script setup>
import { inject, watch } from 'vue';

const { active, toggle } = inject('sharedState');

watch(active, () => {
    if (active.value) {
        window.addEventListener('click', toggle);
    } else {
        window.removeEventListener('click', toggle);
    }
});
</script>

<template>
    <div v-if="active" class="menu">
        <slot />
    </div>
</template>

<style>
.menu {
    cursor: auto;
    position: absolute;
    outline: 0;
    /* top: 100%; */
    min-width: -webkit-max-content;
    min-width: -moz-max-content;
    min-width: max-content;
    margin: 3px 0;
    padding: 0 0;
    background: #fff;
    font-size: 1em;
    text-shadow: none;
    text-align: left;
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-radius: 0.28571429rem;
    transition: opacity 0.1s ease;
    z-index: 1;
    will-change: transform, opacity;
}
</style>
