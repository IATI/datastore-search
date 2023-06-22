<script setup>
import { provide, ref } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';

const active = ref(false);
const toggle = () => (active.value = !active.value);

provide('sharedState', { active, toggle });
</script>

<template>
    <div class="w-fit dropdown" @click.stop="toggle">
        <slot name="toggler">
            <button class="toggler bg-iati-grey">
                Menu <ChevronDownIcon class="inline h-5 w-5 text-grey-300" />
            </button>
        </slot>
    </div>
    <slot />
</template>

<style>
.toggler {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    min-height: 1em;
    outline: 0;
    border: 1px solid #e0e1e2;
    vertical-align: baseline;
    color: rgba(0, 0, 0, 1);
    margin: 0 0.25em 0 0;
    padding: 0.5em 1em;
    text-transform: none;
    text-shadow: none;
    font-weight: 500;
    line-height: 1em;
    font-style: normal;
    text-align: center;
    text-decoration: none;
    border-radius: 0.28571429rem;
    box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34, 36, 38, 0.15) inset;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: opacity 0.1s ease, background-color 0.1s ease, color 0.1s ease, box-shadow 0.1s ease,
        background 0.1s ease;
    will-change: '';
    -webkit-tap-highlight-color: transparent;
}
</style>
