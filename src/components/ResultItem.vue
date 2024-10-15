<template>
    <div class="text-left mb-5">
        <div class="flex mb-2 text-lg">
            <div class="meta">
                {{ $t('message.publisher') }}:
                <b>{{ doc.reporting_org_narrative[0] }}</b>
            </div>
            <div class="meta ml-5">
                {{ $t('message.iati_identifier') }}:
                <b>{{ doc.iati_identifier }}</b>
            </div>
        </div>
        <div class="hover:underline text-sky-700 text-xl font-medium">
            <router-link
                :to="{
                    name: 'activity',
                    params: { iati_identifier: doc.iati_identifier },
                }"
                >{{ doc.title_narrative[0] }}</router-link
            >
        </div>

        <!-- eslint-disable vue/no-v-html -->
        <div class="flex mb-2 text-slate-700">
            <div v-if="doc.actualStart" class="meta">
                {{ $t('message.actual_start') }}:
                <b v-html="prettyDate(doc.actualStart)"></b>
            </div>
            <div v-if="!doc.actualStart && doc.plannedStart" class="meta">
                {{ $t('message.planned_start') }}:
                <b v-html="prettyDate(doc.plannedStart)"></b>
            </div>
            <div
                v-if="!doc.actualStart && !doc.plannedStart"
                class="meta"
            ></div>
            <div v-if="doc.actualEnd" class="meta ml-5">
                {{ $t('message.actual_end') }}:
                <b v-html="prettyDate(doc.actualEnd)"></b>
            </div>
            <div v-if="!doc.actualEnd && doc.plannedEnd" class="meta ml-5">
                {{ $t('message.planned_end') }}:
                <b v-html="prettyDate(doc.plannedEnd)"></b>
            </div>
            <div
                v-if="!doc.actualEnd && !doc.plannedEnd"
                class="meta ml-5"
            ></div>
        </div>
        <div class="border-b pb-2 text-sm">
            <span v-html="doc.highlighting"></span>
        </div>
        <!-- eslint-enable vue/no-v-html -->
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
