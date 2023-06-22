<script setup>
import { inject } from 'vue';

const state = inject('sharedState');
</script>

<template>
    <div class="menu-item" @click="state.toggle">
        <slot />
    </div>
</template>

<style>
.menu-item {
    position: relative;
    cursor: pointer;
    display: block;
    border: none;
    height: auto;
    text-align: left;
    border-top: none;
    line-height: 1em;
    color: rgba(0, 0, 0, 0.87);
    padding: 0.78571429rem 1.14285714rem !important;
    font-size: 1rem;
    text-transform: none;
    font-weight: 400;
    box-shadow: none;
    -webkit-touch-callout: none;
}

.menu-item:hover {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.95);
    z-index: 13;
}
</style>
