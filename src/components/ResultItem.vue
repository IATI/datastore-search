<template>
    <div class="grid grid-cols-10 gap-4 text-left mb-5">
        <div class="col-span-1"></div>
        <div class="col-span-3 meta">
            {{ $t('message.publisher') }}:
            <b>{{ doc.reporting_org_narrative[0] }}</b>
        </div>
        <div class="col-span-3 meta">
            {{ $t('message.iati_identifier') }}:
            <b>{{ doc.iati_identifier }}</b>
        </div>
        <div v-if="doc.actualStart" class="col-span-1 meta">
            {{ $t('message.actual_start') }}:
            <b v-html="prettyDate(doc.actualStart)"></b>
        </div>
        <div v-if="!doc.actualStart && doc.plannedStart" class="col-span-1 meta">
            {{ $t('message.planned_start') }}:
            <b v-html="prettyDate(doc.plannedStart)"></b>
        </div>
        <div v-if="!doc.actualStart && !doc.plannedStart" class="col-span-1 meta"></div>
        <div v-if="doc.actualEnd" class="col-span-1 meta">
            {{ $t('message.actual_end') }}:
            <b v-html="prettyDate(doc.actualEnd)"></b>
        </div>
        <div v-if="!doc.actualEnd && doc.plannedEnd" class="col-span-1 meta">
            {{ $t('message.planned_end') }}:
            <b v-html="prettyDate(doc.plannedEnd)"></b>
        </div>
        <div v-if="!doc.actualEnd && !doc.plannedEnd" class="col-span-1 meta"></div>
        <div class="col-span-1"></div>
        <div class="col-span-1"></div>
        <div class="col-span-8 hover:underline text-sky-700">
            <router-link
                :to="{
                    name: 'activity',
                    params: { iati_identifier: doc.iati_identifier },
                }"
                >{{ doc.title_narrative[0] }}</router-link
            >
        </div>
        <div class="col-span-1"></div>
        <div class="col-span-1"></div>
        <div class="col-span-8 border-b pb-2">
            <!-- eslint-disable vue/no-v-html -->
            <span v-html="doc.highlighting"></span>
        </div>
        <div class="col-span-1"></div>
    </div>
</template>

<script>
export default {
    name: 'ResultItem',
    inject: ['global'],
    props: {
        doc: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    methods: {
        prettyDate: function (dt) {
            const dateString = new Date(dt).toLocaleDateString('en-gb', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            });
            return dateString.replaceAll('/', '/<wbr/>');
        },
    },
};
</script>

<style>
em {
    font-style: bold !important;
}
</style>
