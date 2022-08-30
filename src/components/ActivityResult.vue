<script setup>
import axios from 'axios';
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="flex-grow">
            <router-view />
            <div v-if="activity" class="grid grid-cols-10 gap-4 text-left mb-5">
                <div class="col-span-1"></div>
                <h1 class="col-span-6 mt-10">
                    {{ $t('message.overview_of_iati_activity') }}
                </h1>
                <div
                    v-if="global.state.responseDocs"
                    class="col-span-2 mt-10 pb-2 hover:underline text-sky-700"
                >
                    <router-link v-if="global.state.simpleSearch" to="/simple">
                        {{ $t('message.back_to_results') }}
                    </router-link>
                    <router-link
                        v-if="!global.state.simpleSearch"
                        to="/advanced"
                    >
                        {{ $t('message.back_to_results') }}
                    </router-link>
                </div>
                <div
                    v-if="!global.state.responseDocs"
                    class="col-span-2 mt-10 pb-2"
                ></div>
                <div class="col-span-1"></div>

                <div class="col-span-1"></div>
                <h1 class="col-span-8 text-2xl border-b pb-2">
                    <b>{{ activity.title_narrative }}</b>
                </h1>
                <div class="col-span-1"></div>

                <div class="col-span-1"></div>
                <div class="col-span-8 border-b pb-3">
                    <div class="grid grid-cols-2">
                        <DownloadButtons
                            :iati-identifier="activity.iati_identifier"
                            class="col-span-1"
                        />

                        <div v-if="dPortalLink" class="col-span-1">
                            <b class="block 2xl:inline"
                                >{{ $t('message.view') }}:</b
                            >
                            <a
                                class="bg-iati-grey hover:bg-iati-blue text-white font-bold py-1 px-2 rounded ml-4 w-3/24 block inline-block mb-1"
                                :href="dPortalLink"
                                target="_blank"
                            >
                                <span>d-portal</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-span-1"></div>

                <div class="col-span-1"></div>
                <div class="col-span-2">
                    {{ $t('message.publisher') }}:
                    <b>{{ activity.reporting_org_narrative }}</b>
                </div>
                <div class="col-span-2">
                    {{ $t('message.iati_identifier') }}:
                    <b>{{ activity.iati_identifier }}</b>
                </div>
                <div class="col-span-2">
                    {{ $t('message.last_updated') }}:
                    <b>{{ prettyDateTime(activity.last_updated_datetime) }}</b>
                </div>
                <div class="col-span-3"></div>

                <div class="col-span-1"></div>
                <p class="col-span-8 border-b border-t pt-3 pb-3">
                    {{ activity.description_narrative }}
                </p>
                <div class="col-span-1"></div>
                <div class="col-span-1"></div>
                <div class="col-span-9 border-b pb-3">
                    {{ $t('message.participating_organisations') }}:
                    <span
                        v-for="(
                            org, index
                        ) in activity.participating_org_narrative"
                        :key="index"
                        class="font-semibold"
                        >{{ org
                        }}<span
                            v-if="
                                index !=
                                activity.participating_org_narrative.length - 1
                            "
                            class="font-normal"
                        >
                            |
                        </span></span
                    >
                </div>

                <div class="col-span-1"></div>
                <div class="col-span-2">
                    {{ $t('message.planned_start') }}:
                    <b>{{ prettyDate(dates.plannedStart) }}</b>
                </div>
                <div class="col-span-2">
                    {{ $t('message.actual_start') }}:
                    <b>{{ prettyDate(dates.actualStart) }}</b>
                </div>
                <div class="col-span-2">
                    {{ $t('message.planned_end') }}:
                    <b>{{ prettyDate(dates.plannedEnd) }}</b>
                </div>
                <div class="col-span-2">
                    {{ $t('message.actual_end_date') }}:
                    <b>{{ prettyDate(dates.actualEnd) }}</b>
                </div>
                <div class="col-span-1"></div>
            </div>
        </div>
    </div>
</template>

<script>
import DownloadButtons from './DownloadButtons.vue';

export default {
    name: 'ActivityResult',
    components: {
        DownloadButtons,
    },
    inject: ['global'],
    props: {
        searchType: { type: String, default: '' },
    },
    data: function () {
        return {
            activity: null,
            dates: null,
        };
    },
    computed: {
        dPortalLink() {
            const baseUrl = 'http://d-portal.org/ctrack.html';
            return (
                this.activity &&
                `${baseUrl}?publisher=${this.activity.reporting_org_ref}#view=act&aid=${this.activity.iati_identifier}`
            );
        },
    },
    created() {
        this.requestData();
    },
    methods: {
        prettyDate: function (dt) {
            if (dt === null) {
                return this.$t('message.not_present');
            }
            return new Date(dt).toLocaleDateString('en-gb', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            });
        },

        prettyDateTime: function (dt) {
            return new Date(dt).toLocaleDateString('en-gb', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            });
        },

        requestData: function () {
            const axiosConfig = {
                headers: {
                    'Ocp-Apim-Subscription-Key': import.meta.env
                        .VUE_ENV_APIM_API_KEY,
                },
            };

            const route = this.$route;
            const id = window.encodeURIComponent(route.params.iati_identifier);
            const domain = import.meta.env.VUE_ENV_APIM_DOMAIN;
            const fields = [
                'title_narrative',
                'title_narrative_xml_lang',
                'description_narrative',
                'description_narrative_xml_lang',
                'participating_org_narrative',
                'participating_org_narrative_xml_lang',
                'iati_identifier',
                'last_updated_datetime',
                'reporting_org_ref',
                'reporting_org_narrative',
                'reporting_org_narrative_xml_lang',
                'activity_date',
            ].join(',');
            const baseUrl = `${domain}/dss/activity/select?wt=json&sort=iati_identifier asc&fl=${fields}*&rows=1&q=`;

            axios
                .get(baseUrl + 'iati_identifier:"' + id + '"', axiosConfig)
                .then(({ data }) => {
                    if (data.response.numFound === 0) {
                        this.$router.push({ name: 'NotFound' });
                    } else {
                        this.activity = data.response.docs[0];

                        if ('description_narrative' in this.activity) {
                            if (
                                'description_narrative_xml_lang' in
                                this.activity
                            ) {
                                for (const narrativeKey in this.activity
                                    .description_narrative_xml_lang) {
                                    if (
                                        this.activity
                                            .description_narrative_xml_lang[
                                            narrativeKey
                                        ] === this.global.state.language
                                    ) {
                                        const langDescriptionNarrative =
                                            this.activity.description_narrative[
                                                narrativeKey
                                            ];
                                        this.activity.description_narrative.splice(
                                            narrativeKey,
                                            1
                                        );
                                        this.activity.description_narrative.unshift(
                                            langDescriptionNarrative
                                        );
                                        break;
                                    }
                                }
                            }
                            this.activity.description_narrative =
                                this.activity.description_narrative[0];
                        } else {
                            this.activity.description_narrative = this.$t(
                                'message.description_not_provided'
                            );
                        }
                        if ('title_narrative' in this.activity) {
                            if ('title_narrative_xml_lang' in this.activity) {
                                for (const narrativeKey in this.activity
                                    .title_narrative_xml_lang) {
                                    if (
                                        this.activity.title_narrative_xml_lang[
                                            narrativeKey
                                        ] === this.global.state.language
                                    ) {
                                        const langTitleNarrative =
                                            this.activity.title_narrative[
                                                narrativeKey
                                            ];
                                        this.activity.title_narrative.splice(
                                            narrativeKey,
                                            1
                                        );
                                        this.activity.title_narrative.unshift(
                                            langTitleNarrative
                                        );
                                        break;
                                    }
                                }
                            }
                            this.activity.title_narrative =
                                this.activity.title_narrative[0];
                        } else {
                            this.activity.title_narrative = this.$t(
                                'message.title_not_provided'
                            );
                        }
                        if ('reporting_org_narrative' in this.activity) {
                            if (
                                'reporting_org_narrative_xml_lang' in
                                this.activity
                            ) {
                                for (const narrativeKey in this.activity
                                    .reporting_org_narrative_xml_lang) {
                                    if (
                                        this.activity
                                            .reporting_org_narrative_xml_lang[
                                            narrativeKey
                                        ] === this.global.state.language
                                    ) {
                                        const langReportingOrgNarrative =
                                            this.activity
                                                .reporting_org_narrative[
                                                narrativeKey
                                            ];
                                        this.activity.reporting_org_narrative.splice(
                                            narrativeKey,
                                            1
                                        );
                                        this.activity.reporting_org_narrative.unshift(
                                            langReportingOrgNarrative
                                        );
                                        break;
                                    }
                                }
                            }
                            this.activity.reporting_org_narrative =
                                this.activity.reporting_org_narrative[0];
                        } else {
                            this.activity.reporting_org_narrative = this.$t(
                                'message.name_not_provided'
                            );
                        }
                        if ('participating_org_narrative' in this.activity) {
                            if (
                                'participating_org_narrative_xml_lang' in
                                this.activity
                            ) {
                                let orderedParticipatingOrgs = [];
                                for (const narrativeKey in this.activity
                                    .participating_org_narrative_xml_lang) {
                                    if (
                                        this.activity
                                            .participating_org_narrative_xml_lang[
                                            narrativeKey
                                        ] === this.global.state.language
                                    ) {
                                        orderedParticipatingOrgs.push(
                                            this.activity
                                                .participating_org_narrative[
                                                narrativeKey
                                            ]
                                        );
                                    }
                                }
                                for (const narrativeKey in this.activity
                                    .participating_org_narrative_xml_lang) {
                                    if (
                                        this.activity
                                            .participating_org_narrative_xml_lang[
                                            narrativeKey
                                        ] !== this.global.state.language
                                    ) {
                                        orderedParticipatingOrgs.push(
                                            this.activity
                                                .participating_org_narrative[
                                                narrativeKey
                                            ]
                                        );
                                    }
                                }
                                this.activity.participating_org_narrative =
                                    orderedParticipatingOrgs;
                            }
                        } else {
                            this.activity.participating_org_narrative = [
                                this.$t('message.not_provided'),
                            ];
                        }

                        this.dates = {
                            plannedStart: null,
                            actualStart: null,
                            plannedEnd: null,
                            actualEnd: null,
                        };

                        const activityDateTypes = {
                            planned_start: '1',
                            actual_start: '2',
                            planned_end: '3',
                            actual_end: '4',
                        };

                        for (const key in this.activity['activity_date_type']) {
                            const dt =
                                this.activity['activity_date_iso_date'][key];

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

                        const titleEl = document.querySelector('head title');
                        titleEl.textContent = `${this.activity.title_narrative} - IATI Datastore Search`;

                        const descEl = document.querySelector(
                            'head meta[name="description"]'
                        );
                        descEl.setAttribute(
                            'content',
                            `IATI identifier: ${this.activity.iati_identifier}, ` +
                                `Publisher: ${this.activity.reporting_org_narrative}, ` +
                                `Description: ${this.activity.description_narrative}, ` +
                                `Participating organisations: ${this.activity.participating_org_narrative}`
                        );
                    }
                });
        },
    },
};
</script>
