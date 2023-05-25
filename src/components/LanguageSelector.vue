<script setup>
import { LanguageIcon } from '@heroicons/vue/20/solid';
import { inject } from 'vue';

const global = inject('global');
</script>
<template>
    <div class="inline-block h-10 pt-3 mb-3">
        <LanguageIcon class="h-7 w-7 text-grey-300 float-left mr-1 mt-1" />
        <select
            class="h-10 float-left bg-white border rounded w-auto py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            :value="global.state.language"
            @change="global.changeLocale($event.target.value)"
        >
            <option
                v-for="(langText, langKey) in global.state.available_locales"
                :key="langKey"
                :value="langKey"
            >
                <span>{{ langText }}</span>
            </option>
        </select>
    </div>
</template>
