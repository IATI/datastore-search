<template>
    <div class="flex flex-col h-full min-w-fit sm:min-w-0">
        <div class="text-left">
            <div class="mx-8 md:mx-auto md:max-w-[700px]">
                <h1 class="text-2xl border-b pb-2 mt-10">
                    {{ $t('message.about_iati_datastore_search') }}
                </h1>
                <p class="mt-5" v-html="$t('message.about_para_1')"></p>
                <p class="mt-5 ml-10" v-html="$t('message.about_para_2')"></p>
                <p class="mt-5 ml-10" v-html="$t('message.about_para_3')"></p>
                <p class="mt-5" v-html="$t('message.about_para_4')"></p>
                <p class="mt-5 border-b pb-4"></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AboutPage',
};
</script>
