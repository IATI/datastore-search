<script setup>
import { inject, onMounted, ref, watch } from 'vue';

defineEmits(['search']);
inject('global');

const searchterm = ref('');

onMounted(() => {
    searchterm.value = JSON.parse(sessionStorage.getItem('searchterm')) || '';
});

watch(searchterm, () => {
    sessionStorage.setItem('searchterm', JSON.stringify(searchterm.value));
});
</script>

<template>
    <div class="iati-search-bar">
        <input
            v-model="searchterm"
            :title="$t('message.search')"
            :aria-label="$t('message.search_iati_data')"
            type="text"
            :placeholder="$t('message.search_iati_activities')"
            data-cy="search-input"
            @keyup.enter="$emit('search', searchterm)"
        />
        <button
            role="button"
            :aria-label="$t('message.submit')"
            class="iati-button"
            type="submit"
            data-cy="search-button"
            @click="$emit('search', searchterm)"
        >
            Go
        </button>
    </div>
</template>
