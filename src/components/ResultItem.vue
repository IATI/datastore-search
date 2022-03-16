<template>
  <div class="grid grid-cols-10 gap-4 text-left mb-5">
    <div class="col-span-1"></div>
    <div class="col-span-3 meta">
      Publisher: <b>{{ doc.reporting_org_narrative[0] }}</b>
    </div>
    <div class="col-span-3 meta">IATI Identifer: <b>{{ doc.iati_identifier }}</b></div>
    <div v-if="doc.actualStart" class="col-span-1 meta">Start Date: <b>{{ prettyDate(doc.actualStart) }}</b></div>
    <div v-if="! doc.actualStart && doc.plannedStart" class="col-span-1 meta">Planned Start Date: <b>{{ prettyDate(doc.plannedStart) }}</b></div>
    <div v-if="doc.actualEnd" class="col-span-1 meta">End Date: <b>{{ prettyDate(doc.actualEnd) }}</b></div>
    <div v-if="!doc.actualEnd && doc.plannedEnd" class="col-span-1 meta">Planned End Date: <b>{{ prettyDate(doc.plannedEnd) }}</b></div>
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
  name: "ResultItem",
  inject: ["global"],
  methods: {
    prettyDate: function (dt) {
      return new Date(dt).toLocaleDateString("en-gb", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    },
  },
  props: {
    doc: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style>
em {
  font-style: bold !important;
}
</style>
