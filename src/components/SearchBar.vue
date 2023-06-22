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
    <div class="flex justify-left">
        <div class="flex border-2 rounded my-3">
            <input
                v-model="searchterm"
                :title="$t('message.search')"
                :aria-label="$t('message.search_iati_data')"
                type="text"
                class="px-4 py-2 placeholder-gray-600 search-bar"
                :placeholder="$t('message.search_iati_activities')"
                data-cy="search-input"
                @keyup.enter="$emit('search', searchterm)"
            />
            <button
                role="button"
                :aria-label="$t('message.submit')"
                class="flex items-center justify-center px-4 border-l"
                data-cy="search-button"
                @click="$emit('search', searchterm)"
            >
                <svg
                    class="w-6 h-6 text-gray-600"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>
