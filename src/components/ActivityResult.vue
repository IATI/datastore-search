<script setup>
import axios from 'axios';
import { computed, inject, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import i18n from '../i18n.js';
import DownloadButtons from './DownloadButtons.vue';
import LoadingSpinner from './LoadingSpinner.vue';

const { t } = i18n.global;

defineProps({ searchType: { type: String, default: '' } });

const global = inject('global');
const router = useRouter();
const route = useRoute();
const activity = ref(null);
const dates = ref(null);
const dPortalLink = computed(() => {
    const baseUrl = 'https://d-portal.org/ctrack.html';
    return (
        activity.value &&
        `${baseUrl}?publisher=${activity.value.reporting_org_ref}#view=act&aid=${activity.value.iati_identifier}`
    );
});

const requestData = () => {
    const axiosConfig = {
        headers: {
            'Ocp-Apim-Subscription-Key': import.meta.env.VUE_ENV_APIM_API_KEY,
        },
    };

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
                router.push({ name: 'NotFound' });
            } else {
                activity.value = data.response.docs[0];

                if ('description_narrative' in activity.value) {
                    if ('description_narrative_xml_lang' in activity.value) {
                        for (const narrativeKey in activity.value
                            .description_narrative_xml_lang) {
                            if (
                                activity.value.description_narrative_xml_lang[
                                    narrativeKey
                                ] === global.state.language
                            ) {
                                const langDescriptionNarrative =
                                    activity.value.description_narrative[
                                        narrativeKey
                                    ];
                                activity.value.description_narrative.splice(
                                    narrativeKey,
                                    1,
                                );
                                activity.value.description_narrative.unshift(
                                    langDescriptionNarrative,
                                );
                                break;
                            }
                        }
                    }
                    activity.value.description_narrative =
                        activity.value.description_narrative[0];
                } else {
                    activity.value.description_narrative = t(
                        'message.description_not_provided',
                    );
                }
                if ('title_narrative' in activity.value) {
                    if ('title_narrative_xml_lang' in activity.value) {
                        for (const narrativeKey in activity.value
                            .title_narrative_xml_lang) {
                            if (
                                activity.value.title_narrative_xml_lang[
                                    narrativeKey
                                ] === global.state.language
                            ) {
                                const langTitleNarrative =
                                    activity.value.title_narrative[
                                        narrativeKey
                                    ];
                                activity.value.title_narrative.splice(
                                    narrativeKey,
                                    1,
                                );
                                activity.value.title_narrative.unshift(
                                    langTitleNarrative,
                                );
                                break;
                            }
                        }
                    }
                    activity.value.title_narrative =
                        activity.value.title_narrative[0];
                } else {
                    activity.value.title_narrative = t(
                        'message.title_not_provided',
                    );
                }
                if ('reporting_org_narrative' in activity.value) {
                    if ('reporting_org_narrative_xml_lang' in activity.value) {
                        for (const narrativeKey in activity.value
                            .reporting_org_narrative_xml_lang) {
                            if (
                                activity.value.reporting_org_narrative_xml_lang[
                                    narrativeKey
                                ] === global.state.language
                            ) {
                                const langReportingOrgNarrative =
                                    activity.value.reporting_org_narrative[
                                        narrativeKey
                                    ];
                                activity.value.reporting_org_narrative.splice(
                                    narrativeKey,
                                    1,
                                );
                                activity.value.reporting_org_narrative.unshift(
                                    langReportingOrgNarrative,
                                );
                                break;
                            }
                        }
                    }
                    activity.value.reporting_org_narrative =
                        activity.value.reporting_org_narrative[0];
                } else {
                    activity.value.reporting_org_narrative = t(
                        'message.name_not_provided',
                    );
                }
                if ('participating_org_narrative' in activity.value) {
                    if (
                        'participating_org_narrative_xml_lang' in activity.value
                    ) {
                        let orderedParticipatingOrgs = [];
                        for (const narrativeKey in activity.value
                            .participating_org_narrative_xml_lang) {
                            if (
                                activity.value
                                    .participating_org_narrative_xml_lang[
                                    narrativeKey
                                ] === global.state.language
                            ) {
                                orderedParticipatingOrgs.push(
                                    activity.value.participating_org_narrative[
                                        narrativeKey
                                    ],
                                );
                            }
                        }
                        for (const narrativeKey in activity.value
                            .participating_org_narrative_xml_lang) {
                            if (
                                activity.value
                                    .participating_org_narrative_xml_lang[
                                    narrativeKey
                                ] !== global.state.language
                            ) {
                                orderedParticipatingOrgs.push(
                                    activity.value.participating_org_narrative[
                                        narrativeKey
                                    ],
                                );
                            }
                        }
                        activity.value.participating_org_narrative =
                            orderedParticipatingOrgs;
                    }
                } else {
                    activity.value.participating_org_narrative = [
                        t('message.not_provided'),
                    ];
                }

                dates.value = {
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

                for (const key in activity.value['activity_date_type']) {
                    const dt = activity.value['activity_date_iso_date'][key];

                    switch (activity.value['activity_date_type'][key]) {
                        case activityDateTypes.planned_start:
                            dates.value['plannedStart'] = dt;
                            break;
                        case activityDateTypes.actual_start:
                            dates.value['actualStart'] = dt;
                            break;
                        case activityDateTypes.planned_end:
                            dates.value['plannedEnd'] = dt;
                            break;
                        case activityDateTypes.actual_end:
                            dates.value['actualEnd'] = dt;
                            break;
                    }
                }

                const titleEl = document.querySelector('head title');
                titleEl.textContent = `${activity.value.title_narrative} - IATI Datastore Search`;

                const descEl = document.querySelector(
                    'head meta[name="description"]',
                );
                descEl.setAttribute(
                    'content',
                    `IATI identifier: ${activity.value.iati_identifier}, ` +
                        `Publisher: ${activity.value.reporting_org_narrative}, ` +
                        `Description: ${activity.value.description_narrative}, ` +
                        `Participating organisations: ${activity.value.participating_org_narrative}`,
                );
            }
        });
};

const prettyDate = (dt) => {
    if (dt === null) {
        return t('message.not_present');
    }
    return new Date(dt).toLocaleDateString('en-gb', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
};

const prettyDateTime = (dt) => {
    return new Date(dt).toLocaleDateString('en-gb', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
};

onBeforeMount(() => {
    requestData();
});
</script>

<template>
    <div class="flex flex-col h-full mx-5">
        <div class="flex-grow">
            <router-view />
            <LoadingSpinner v-if="!activity" class="w-full" />
            <div v-if="activity" class="text-left mb-5 font-medium">
                <div v-if="global.state.responseDocs" class="mt-4 text-sky-700">
                    <span
                        class="cursor-pointer hover:underline"
                        @click="$router.go(-1)"
                    >
                        {{ $t('message.back_to_results') }}
                    </span>
                </div>
                <h1 class="mt-5 text-lg">
                    {{ $t('message.overview_of_iati_activity') }}
                </h1>
                <h1
                    class="mt-4 pb-2 text-2xl border-b border-dashed break-words text-iati-grey"
                >
                    <b>{{ activity.title_narrative }}</b>
                </h1>
                <div class="border-b border-dashed py-3 flex items-center">
                    <DownloadButtons
                        :iati-identifier="activity.iati_identifier"
                    />
                    <a
                        v-if="dPortalLink"
                        class="bg-iati-grey hover:bg-iati-blue text-white rounded font-medium py-[0.4rem] px-3 ml-4 w-3/24 block"
                        :href="dPortalLink"
                        target="_blank"
                    >
                        <span class="text-base"
                            >{{ $t('message.view_on') }} d-portal</span
                        >
                    </a>
                </div>

                <div class="flex-col lg:flex-row flex py-4 font-light">
                    <div class="mr-5 md:flex mb-2 lg:mb-0">
                        <div class="mr-5 mb-2 md:mb-0">
                            {{ $t('message.publisher') }}:
                            <b class="font-semibold">{{
                                activity.reporting_org_narrative
                            }}</b>
                        </div>
                        <div>
                            {{ $t('message.iati_identifier') }}:
                            <b class="font-semibold">{{
                                activity.iati_identifier
                            }}</b>
                        </div>
                    </div>
                    <div class="">
                        {{ $t('message.last_updated') }}:
                        <b class="font-semibold">{{
                            prettyDateTime(activity.last_updated_datetime)
                        }}</b>
                    </div>
                </div>

                <p class="pt-3 pb-4 break-words">
                    {{ activity.description_narrative }}
                </p>

                <div class="pt-3">
                    <span class="font-normal">
                        {{ $t('message.participating_organisations') }}:
                    </span>
                    <span
                        v-for="(
                            org, index
                        ) in activity.participating_org_narrative"
                        :key="index"
                        class="font-semibold"
                    >
                        {{ org }}
                        <span
                            v-if="
                                index !=
                                activity.participating_org_narrative.length - 1
                            "
                            class="font-normal"
                        >
                            |
                        </span>
                    </span>
                </div>

                <div class="flex font-normal flex-col md:flex-row pt-3">
                    <div class="mr-5 flex mb-2 lg:mb-0">
                        <div class="mr-5">
                            {{ $t('message.planned_start') }}:
                            <b>{{ prettyDate(dates.plannedStart) }}</b>
                        </div>
                        <div class="">
                            {{ $t('message.actual_start') }}:
                            <b>{{ prettyDate(dates.actualStart) }}</b>
                        </div>
                    </div>
                    <div class="mr-5 flex mb-2 lg:mb-0">
                        <div class="mr-5">
                            {{ $t('message.planned_end') }}:
                            <b>{{ prettyDate(dates.plannedEnd) }}</b>
                        </div>
                        <div class="">
                            {{ $t('message.actual_end') }}:
                            <b>{{ prettyDate(dates.actualEnd) }}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
