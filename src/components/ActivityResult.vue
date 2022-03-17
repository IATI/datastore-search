<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-grow">
      <router-view />
      <div
        v-if="activity != null"
        class="grid grid-cols-10 gap-4 text-left mb-5"
      >
        <div class="col-span-1"></div>
        <h1 class="col-span-6 mt-10">Overview of IATI Activity</h1>
        <div
          v-if="global.state.responseDocs"
          class="col-span-2 mt-10 pb-2 hover:underline text-sky-700"
        >
          <router-link v-if="global.state.simpleSearch" to="/simple">
            Back to results</router-link
          >
          <router-link v-if="!global.state.simpleSearch" to="/advanced">
            Back to results</router-link
          >
        </div>
        <div
          v-if="!global.state.responseDocs"
          class="col-span-2 mt-10 pb-2"
        ></div>
        <div class="col-span-1"></div>

        <div class="col-span-1"></div>
        <h1 class="col-span-8 text-2xl border-b pb-2">
          <b>{{ activity.title_narrative[0] }}</b>
        </h1>
        <div class="col-span-1"></div>

        <div class="col-span-1"></div>
        <div class="col-span-8 border-b pb-3">
          <DownloadButtons :iati-identifier="activity.iati_identifier" />
        </div>
        <div class="col-span-1"></div>

        <div class="col-span-1"></div>
        <div class="col-span-2">
          Publisher: <b>{{ activity.reporting_org_narrative[0] }}</b>
        </div>
        <div class="col-span-2">
          IATI Identifier <b>{{ activity.iati_identifier }}</b>
        </div>
        <div class="col-span-2">
          Last updated: <b>{{ prettyDateTime(activity.last_updated_datetime) }}</b>
        </div>
        <div class="col-span-3"></div>
        
        <div class="col-span-1"></div>
        <p class="col-span-8 border-b border-t pt-3 pb-3">
          {{ activity.description_narrative[0] }}
        </p>
        <div class="col-span-1"></div>
        <div class="col-span-1"></div>
        <div class="col-span-9 border-b pb-3">
          Participating organisations:
          <span
            v-for="(org, index) in activity.participating_org_narrative"
            :key="index"
            class="font-semibold"
            >{{ org
            }}<span
              v-if="index != activity.participating_org_narrative.length - 1"
              class="font-normal"
            >
              |
            </span></span
          >
        </div>

        <div class="col-span-1"></div>
        <div class="col-span-2">
          Planned Start: <b>{{ prettyDate(dates.plannedStart) }}</b>
        </div>
        <div class="col-span-2">
          Actual Start: <b>{{ prettyDate(dates.actualStart) }}</b>
        </div>
        <div class="col-span-2">
          Planned End: <b>{{ prettyDate(dates.plannedEnd) }}</b>
        </div>
        <div class="col-span-2">
          Actual End Date: <b>{{ prettyDate(dates.actualEnd) }}</b>
        </div>
        <div class="col-span-1"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadButtons from "./DownloadButtons.vue";
import { pageview } from "vue-gtag";

export default {
  name: "ActivityResult",
  components: {
    DownloadButtons,
  },
  inject: ["global"],
  props: {
    searchType: { type: String, default: "" },
  },
  data: function () {
    return {
      activity: null,
      dates: null
    };
  },
  created() {
    this.requestData();
  },
  methods: {
    prettyDate: function (dt) {
      if (dt === null) {
        return "Not Present"
      }
      return new Date(dt).toLocaleDateString("en-gb", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    },

    prettyDateTime: function (dt) {
      return new Date(dt).toLocaleDateString("en-gb", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    },

    requestData: function () {
      const axiosConfig = {
        headers: {
          "Ocp-Apim-Subscription-Key": import.meta.env.VUE_ENV_APIM_API_KEY,
        },
      };

      const route = useRoute();
      const id = encodeURIComponent(route.params.iati_identifier);
      const domain = import.meta.env.VUE_ENV_APIM_DOMAIN;
      const baseUrl =
        domain +
        "/dss/activity/select?wt=json&sort=iati_identifier asc&fl=title_narrative, description_narrative, participating_org_narrative, iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&rows=1&q=";

      axios
        .get(baseUrl + 'iati_identifier:"' + id + '"', axiosConfig)
        .then(({ data }) => {
          if (data.response.numFound === 0) {
            this.$router.push({ name: "NotFound" });
          } else {
            this.activity = data.response.docs[0];

            this.dates = {
              'plannedStart': null,
              'actualStart': null,
              'plannedEnd': null,
              'actualEnd': null
            }

            const activityDateTypes = {
              'planned_start': '1',
              'actual_start': '2',
              'planned_end': '3',
              'actual_end': '4'
            }

            for (const key in this.activity['activity_date_type']) {
              const dt = this.activity['activity_date_iso_date'][key];

              switch (this.activity['activity_date_type'][key]) {
                case activityDateTypes.planned_start:
                  this.dates['plannedStart'] = dt;
                  break;
                case activityDateTypes.actual_start:
                  this.dates['actualStart'] = dt;
                  break;
                case activityDateTypes.planned_end:
                  this.dates['plannedEnd'] = dt;
                  break;
                case activityDateTypes.actual_end:
                  this.dates['actualEnd'] = dt;
                  break;
              }
            }

            const titleEl = document.querySelector("head title");
            titleEl.textContent = `${this.activity.title_narrative[0]} - IATI Datastore Search`;

            const descEl = document.querySelector(
              'head meta[name="description"]'
            );
            descEl.setAttribute(
              "content",
              `IATI identifier: ${this.activity.iati_identifier}, ` +
                `Publisher: ${this.activity.reporting_org_narrative[0]}, ` +
                `Description: ${this.activity.description_narrative[0]}, ` +
                `Participating organisations: ${this.activity.participating_org_narrative}`
            );
            pageview({
              page_path: this.$route.fullPath,
              page_title: this.activity.title_narrative[0],
            });
          }
        });
    },
  },
};
</script>
