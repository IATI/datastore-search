<script setup>
import { inject } from 'vue';

const global = inject('global');
</script>
<template>
    <div class="iati-country-switcher">
        <label for="iati-country-switcher" class="iati-country-switcher__label">
            {{ $t('message.choose_language') }}
        </label>
        <select
            class="iati-country-switcher__control"
            :value="global.state.language"
            @change="global.changeLocale($event.target.value)"
        >
            <option
                v-for="(langText, langKey) in global.state.available_locales"
                :key="langKey"
                :value="langKey"
            >
                {{ langText }}
            </option>
        </select>
    </div>
</template>
