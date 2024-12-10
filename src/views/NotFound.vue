<template>
    <h1 class="text-3xl pt-5">{{ $t('message.not_found') }}</h1>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="text-lg p-4" v-html="$t('message.not_found_para')"></p>
</template>

<script>
export default {
    name: 'NotFound',
};
</script>
