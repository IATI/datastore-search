//Simple global state and API management
import { reactive, readonly } from 'vue';
import axios from 'axios';
import { startOfToday, format } from 'date-fns';
import MD5 from 'crypto-js/md5';
import Plausible from 'plausible-tracker';
import i18n from './i18n.js';

const { t } = i18n.global;
const browser_locale = navigator.language.split('-')[0] || navigator.userLanguage.split('-')[0];
let language = JSON.parse(localStorage.getItem('language')) || '';

if (language === '') {
    language = browser_locale;
}

const { trackEvent } = Plausible();

if (browser_locale != 'en') {
    trackEvent('Localisation', {
        props: {
            event_category: 'Language',
            event_label: navigator.language,
        },
    });
}

const available_locales = {
    en: 'English',
    fr: 'Français',
};

if (!Object.keys(available_locales).includes(language)) {
    language = 'en';
}

i18n.global.locale = language;
localStorage.setItem('language', JSON.stringify(language));

const axiosConfig = {
    headers: {
        'Ocp-Apim-Subscription-Key': import.meta.env.VUE_ENV_APIM_API_KEY,
    },
};

const activityDateTypes = {
    planned_start: '1',
    actual_start: '2',
    planned_end: '3',
    actual_end: '4',
};

const sortFields = [
    {
        verbose: t('message.relevance'),
        field: 'score',
        label: t('message.sort_relevance_label'),
        default: 'desc',
    },
    {
        verbose: t('message.identifier'),
        field: 'iati_identifier',
        label: t('message.sort_identifier_label'),
        default: 'asc',
    },
];

const domain = import.meta.env.VUE_ENV_APIM_DOMAIN;

const baseUrl =
    domain +
    '/dss/activity/select?wt=json&fl=id,title_narrative,title_narrative_xml_lang,description_narrative,description_narrative_xml_lang,iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative';
const baseUrlSimple =
    domain +
    '/dss/activity/search?wt=json&fl=id,title_narrative,title_narrative_xml_lang,description_narrative,description_narrative_xml_lang,iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative';
const baseUrlActivity =
    domain +
    '/dss/activity/select?wt=json&sort=iati_identifier asc&fl=title_narrative,title_narrative_xml_lang,description_narrative,description_narrative_xml_lang,iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&rows=1&hl=true&hl.method=unified&hl.fl=*_narrative&q=';
const baseUrlDownload = domain + '/dss/download';

const state = reactive({
    available_locales: available_locales,
    language: language,
    nextFilterId: 0,
    queryInProgress: false,
    filters: [],
    fieldOptions: [],
    query: null, //A Solr query string compiled from the filters
    responseDocs: null, //The array of Solr docs received from the DS API after making query,
    responseTotal: null, //Total number of docs in response
    responseStart: null, //The start offset of the response, which should be in multiples of resultsPerPage
    resultsPerPage: 10, //results shown per page of UI
    numberPages: null, // Total number of pages responseTotal/resultsPerPage
    page: 1,
    simpleSearch: null,
    simpleSearchTerm: null,
    searchOrderField: 'score',
    searchOrderDirection: 'desc',
    activity: null,
    download: {
        formats: ['XML', 'JSON', 'CSV', 'EXCEL'],
        fileLoading: false,
        showModal: false,
        selectedFormat: null,
    },
    export: {
        showModal: false,
        fileLoading: false,
    },
    import: {
        disabled: true,
        showModal: false,
        fileLoading: false,
        errors: [],
        file: null,
    },
    bbox: {
        showModal: false,
        displayPrecision: 2,
        centerLat: 0,
        centerLon: 0,
        zoom: 3,
        southWestLat: null,
        southWestLon: null,
        northEastLat: null,
        northEastLon: null,
        filterId: null,
    },
    codelistURL: import.meta.env.VUE_ENV_CODELIST_URL,
    responseErrorMessage: '',
});

const allNarrativesOption = {
    field: 'iati_text',
    label: t('message.all_narratives'),
    type: 'text',
    description: t('message.all_narratives_desc'),
    name: 'narrative',
    path: 'iati-activities/iati-activity//narrative',
    xsd_type: '',
    solr_required: 'false',
    solr_multivalued: 'true',
};

const groupingOption = {
    field: '()',
    label: t('message.boolean_grouping'),
    type: 'grouping',
    description: t('message.boolean_grouping_desc'),
    name: '',
    path: '',
    xsd_type: '',
    solr_required: 'false',
    solr_multivalued: 'false',
};

const spatialOption = {
    field: 'location_point_latlon',
    label: t('message.spatial_search'),
    type: 'latlon',
    description: t('message.location_point_latlon_desc'),
    name: 'pos',
    path: 'iati-activities/iati-activity/location/point/pos',
    xsd_type: '',
    solr_required: 'false',
    solr_multivalued: 'true',
};

const populateOptions = async () => {
    let filterOptions = null;

    let response = await axios.get(
        `${domain}/dss/resources/filters?locale=${state.language}`,
        axiosConfig
    );

    filterOptions = response.data;

    response = await axios.get(
        `${domain}/dss/resources/codelists?locale=${state.language}`,
        axiosConfig
    );

    const codelists = response.data;

    for (const index in filterOptions) {
        if (filterOptions[index].type === 'select') {
            // remove versions 1.X from dataset_version field
            if (filterOptions[index].field === 'dataset_version') {
                filterOptions[index]['options'] = codelists[
                    filterOptions[index].codelist_name
                ].data.filter((codeObj) => !codeObj.code.includes('1.'));
            } else {
                filterOptions[index]['options'] =
                    codelists[filterOptions[index].codelist_name].data;
            }
            filterOptions[index].codelistMeta =
                codelists[filterOptions[index].codelist_name].metadata;
            // Set conditional codelists to 'combo'
            if (filterOptions[index].codelist_condition != '') {
                filterOptions[index].type = 'combo';
            }
        }
    }

    const specialOptions = [
        {
            field: '',
            label: `${t('message.special_fields')}:`,
            disabled: true,
        },
        { ...allNarrativesOption },
        { ...spatialOption },
        {
            field: '',
            label: `${t('message.grouping')}:`,
            disabled: true,
        },
        { ...groupingOption },
        {
            field: '',
            label: `${t('message.standard_fields')}:`,
            disabled: true,
        },
    ];

    state.fieldOptions = specialOptions.concat(filterOptions);
};

if (state.fieldOptions.length === 0) {
    populateOptions();
}

//API implementation, and then exported:
const addFilter = async () => {
    const filterId = 'filter-' + state.nextFilterId;
    state.nextFilterId = state.nextFilterId + 1;
    state.filters.push({
        id: filterId,
        type: null,
        field: null,
        value: null,
        operator: 'equals',
        joinOperator: 'AND',
    });
    return filterId;
};

const setFilters = (filters) => {
    state.filters = filters;
};

const removeFilter = (id) => {
    state.filters = state.filters.filter(function (filter) {
        return filter.id !== id;
    });
};

export const importSimpleSearchToAdv = async () => {
    state.filters = [
        {
            id: 'filter-0',
            type: allNarrativesOption.type,
            field: allNarrativesOption.field,
            value: state.query,
            operator: 'equals',
            joinOperator: 'AND',
            selectedOption: {
                ...allNarrativesOption,
            },
            desc: allNarrativesOption.description,
        },
    ];
    state.nextFilterId = 1;
};

export const toggleExportModal = () => {
    state.export.errors = [];
    state.export.showModal = !state.export.showModal;
};

export const toggleImportModal = () => {
    state.import.errors = [];
    state.import.showModal = !state.import.showModal;
};

const importFilters = async () => {
    state.import.errors = [];
    state.import.fileLoading = true;
    await populateOptions();
    const filterHash = state.import.file.hash;
    const filterData = state.import.file.data;
    if (MD5(JSON.stringify(filterData)).toString() === filterHash) {
        state.filters = [...filterData];

        for (let i = 0; i < state.filters.length; i++) {
            if (state.filters[i].type === 'date') {
                state.filters[i].value = new Date(state.filters[i].value);
            }
        }

        const lastFilterId = state.filters
            .map((d) => parseInt(d.id.split('-')[1], 10))
            .sort(function (a, b) {
                return a - b;
            })[state.filters.length - 1];
        state.nextFilterId = lastFilterId + 1;
        state.import.disabled = true;
        toggleImportModal();
        trackEvent('Imported Filters', {
            props: {
                event_category: 'Advanced',
            },
        });
    } else {
        state.import.errors.push(t('message.incompatible_file_error'));
    }
    state.import.fileLoading = false;
};

const stageFilter = (event) => {
    state.import.errors = [];
    state.import.disabled = true;
    try {
        state.import.file = JSON.parse(event.target.result);
        state.import.disabled = false;
    } catch (error) {
        state.import.errors.push(t('message.incompatible_file_error'));
        state.import.file = {};
    }
};

export const onFilePicked = (event) => {
    const files = event.target.files;
    const reader = new FileReader();
    // Setup the callback event to run when the file is read
    reader.onload = stageFilter;

    // Read the file
    reader.readAsText(files[0]);
};

export const exportFilters = () => {
    const date = new Date();
    state.export.fileLoading = true;
    const filterHash = MD5(JSON.stringify(state.filters)).toString();
    const exportObj = {
        hash: filterHash,
        data: state.filters,
    };
    const blob = new Blob([JSON.stringify(exportObj)], {
        type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `IATI_Datastore_Search_Filters_${date.toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    state.export.fileLoading = false;
    state.export.showModal = false;
    trackEvent('Exported Filters', {
        props: {
            event_category: 'Advanced',
        },
    });
};

// don't allow use of Functions in DSS
const disallowedStrings = ['{!func}', '_val_'];

const validateFilter = (filter) => {
    let count = 0;
    // require input value check
    if (filter.value === null || filter.value === '') {
        switch (filter.type) {
            case 'text':
                count += 1;
                return [
                    count,
                    {
                        ...filter,
                        valid: false,
                        validationMessage: t('message.search_term_is_required'),
                    },
                ];
            case 'combo':
                count += 1;
                return [
                    count,
                    {
                        ...filter,
                        valid: false,
                        validationMessage: t('message.search_term_is_required'),
                    },
                ];
            case 'boolean':
                count += 1;
                return [
                    count,
                    {
                        ...filter,
                        valid: false,
                        validationMessage: t('message.selection_is_required'),
                    },
                ];
            case 'grouping':
                count += 1;
                return [
                    count,
                    {
                        ...filter,
                        valid: false,
                        validationMessage: t('message.selection_is_required'),
                    },
                ];
            case 'number':
                count += 1;
                return [
                    count,
                    {
                        ...filter,
                        valid: false,
                        validationMessage: t('message.value_is_required'),
                    },
                ];
            case 'integer':
                count += 1;
                return [
                    count,
                    {
                        ...filter,
                        valid: false,
                        validationMessage: t('message.value_is_required'),
                    },
                ];
            case 'latlon':
                count += 1;
                return [
                    count,
                    {
                        ...filter,
                        valid: false,
                        validationMessage: t('message.value_is_required'),
                    },
                ];
            case 'date':
                count += 1;
                return [
                    count,
                    {
                        ...filter,
                        valid: false,
                        validationMessage: t('message.date_is_required'),
                    },
                ];
            case 'select':
                count += 1;
                return [
                    count,
                    {
                        ...filter,
                        valid: false,
                        validationMessage: t('message.selection_is_required'),
                    },
                ];
            default:
                break;
        }
    }

    // Disallowed strings to prevent Solr Function queries
    if (filter.type === 'text' || filter.type === 'combo') {
        const badStrs = disallowedStrings.reduce((acc, str) => {
            if (filter.value.includes(str)) {
                acc.push(str);
            }
            return acc;
        }, []);

        if (badStrs.length > 0) {
            count += 1;
            return [
                count,
                {
                    ...filter,
                    valid: false,
                    validationMessage: t('message.is_not_allowed', {
                        bad: badStrs.join(),
                    }),
                },
            ];
        }
    }

    // percentages 0 to 100 check
    if (
        filter.type === 'number' &&
        filter.field.includes('_percentage') &&
        (filter.value < 0 || filter.value > 100)
    ) {
        count += 1;
        return [
            count,
            {
                ...filter,
                valid: false,
                validationMessage: t('message.percentage_validation'),
            },
        ];
    }
    // integer check
    if (filter.type === 'integer' && !Number.isInteger(filter.value)) {
        count += 1;
        return [
            count,
            {
                ...filter,
                valid: false,
                validationMessage: t('message.integer_validation'),
            },
        ];
    }
    return [count, filter];
};

const validateFilters = () => {
    let count = 0;
    state.filters = state.filters.map((filter) => {
        const [errorsCount, validatedFilter] = validateFilter({ ...filter });
        count += errorsCount;

        return validatedFilter;
    });
    return count === 0;
};

const run = async (start = 0, rows = 10) => {
    state.responseTotal = null;
    state.query = null;
    state.responseErrorMessage = '';

    if (validateFilters()) {
        state.queryInProgress = true;
        await compileQuery();
        let url = new URL(baseUrl);
        url.searchParams.set('q', state.query);
        url.searchParams.set('start', start);
        url.searchParams.set('rows', rows);
        url.searchParams.set('sort', `${state.searchOrderField} ${state.searchOrderDirection}`);
        let result = {
            data: {
                response: {
                    docs: [],
                    numFound: 0,
                    start: 0,
                },
                highlighting: {},
            },
        };
        try {
            result = await axios.get(url, axiosConfig);
        } catch (error) {
            state.responseErrorMessage = t('message.fetch_error');
        }

        state.simpleSearch = false;

        setResponseState(result);
    }
    if (start === 0) {
        trackEvent('Run query', {
            props: {
                event_category: 'Advanced',
                event_label: state.query,
            },
        });
    }
};

const runSimple = async (searchterm, start = 0, rows = 10) => {
    state.queryInProgress = true;
    state.responseTotal = null;
    state.query = null;
    state.responseErrorMessage = '';

    // Clean search term to prevent Solr Function Queries and clean quotes
    const cleanSearchTerm = cleanSolrQueryString(searchterm);

    state.simpleSearchTerm = cleanSearchTerm;
    let url = new URL(baseUrlSimple);
    url.searchParams.set('q', cleanSearchTerm);
    url.searchParams.set('start', start);
    url.searchParams.set('rows', rows);
    url.searchParams.set('sort', `${state.searchOrderField} ${state.searchOrderDirection}`);
    let result = await axios.get(url, axiosConfig);
    state.simpleSearch = true;
    state.query = cleanSearchTerm;
    state.responseTotal = null;
    setResponseState(result);

    if (start === 0) {
        trackEvent('Run query', {
            props: {
                event_category: 'Simple',
                event_label: state.query,
            },
        });
    }
};

const setResponseState = (result) => {
    state.responseDocs = result.data.response.docs;

    for (const keyA in state.responseDocs) {
        for (const keyB in state.responseDocs[keyA]['activity_date_type']) {
            const dt = state.responseDocs[keyA]['activity_date_iso_date'][keyB];

            switch (state.responseDocs[keyA]['activity_date_type'][keyB]) {
                case activityDateTypes.planned_start:
                    state.responseDocs[keyA]['plannedStart'] = dt;
                    break;
                case activityDateTypes.actual_start:
                    state.responseDocs[keyA]['actualStart'] = dt;
                    break;
                case activityDateTypes.planned_end:
                    state.responseDocs[keyA]['plannedEnd'] = dt;
                    break;
                case activityDateTypes.actual_end:
                    state.responseDocs[keyA]['actualEnd'] = dt;
                    break;
            }
        }
    }

    let index = 0;

    for (const keyA in result.data.highlighting) {
        for (const keyB in result.data.highlighting[keyA]) {
            if (result.data.highlighting[keyA][keyB].length < 1) {
                delete result.data.highlighting[keyA][keyB];
            }
        }

        state.responseDocs[index]['highlighting'] = '';

        for (const prop in result.data.highlighting[keyA]) {
            state.responseDocs[index]['highlighting'] =
                state.responseDocs[index]['highlighting'] +
                '"' +
                result.data.highlighting[keyA][prop] +
                '" ... ';
        }

        state.responseDocs[index]['highlighting'] = state.responseDocs[index][
            'highlighting'
        ].substring(0, state.responseDocs[index]['highlighting'].length - 5);

        state.responseDocs[index]['highlighting'] = state.responseDocs[index][
            'highlighting'
        ].replaceAll('",', '"');

        let langTitleNarrative = t('message.title_not_provided');
        if ('title_narrative' in state.responseDocs[index]) {
            if ('title_narrative_xml_lang' in state.responseDocs[index]) {
                if (
                    state.responseDocs[index].title_narrative_xml_lang.length ===
                    state.responseDocs[index].title_narrative.length
                ) {
                    // First remove blank titles, iterating backwards
                    for (
                        let narrativeKey =
                            state.responseDocs[index].title_narrative_xml_lang.length - 1;
                        narrativeKey >= 0;
                        narrativeKey--
                    ) {
                        if (state.responseDocs[index].title_narrative[narrativeKey] === '') {
                            state.responseDocs[index].title_narrative.splice(narrativeKey, 1);
                            state.responseDocs[index].title_narrative_xml_lang.splice(
                                narrativeKey,
                                1
                            );
                        }
                    }
                    // Then preference locale, if still available
                    if (state.responseDocs[index].title_narrative_xml_lang.length > 0) {
                        for (const narrativeKey in state.responseDocs[index]
                            .title_narrative_xml_lang) {
                            if (
                                state.responseDocs[index].title_narrative_xml_lang[narrativeKey] ===
                                state.language
                            ) {
                                langTitleNarrative =
                                    state.responseDocs[index].title_narrative[narrativeKey];
                                state.responseDocs[index].title_narrative.splice(narrativeKey, 1);
                                state.responseDocs[index].title_narrative.unshift(
                                    langTitleNarrative
                                );
                                state.responseDocs[index].title_narrative_xml_lang.splice(
                                    narrativeKey,
                                    1
                                );
                                state.responseDocs[index].title_narrative_xml_lang.unshift(
                                    state.language
                                );
                                break;
                            }
                        }
                    } else {
                        // No non-blank titles, set a default
                        state.responseDocs[index].title_narrative = [langTitleNarrative];
                    }
                } else {
                    langTitleNarrative = state.responseDocs[index].title_narrative[0];
                }
            } else {
                langTitleNarrative = state.responseDocs[index].title_narrative[0];
            }
        } else {
            state.responseDocs[index].title_narrative = [langTitleNarrative];
        }

        if (state.responseDocs[index]['highlighting'] === '') {
            if ('description_narrative' in state.responseDocs[index]) {
                if ('description_narrative_xml_lang' in state.responseDocs[index]) {
                    if (
                        state.responseDocs[index].description_narrative_xml_lang.length ===
                        state.responseDocs[index].description_narrative.length
                    ) {
                        // First remove blank descriptions, iterating backwards
                        for (
                            let narrativeKey =
                                state.responseDocs[index].description_narrative_xml_lang.length - 1;
                            narrativeKey >= 0;
                            narrativeKey--
                        ) {
                            if (
                                state.responseDocs[index].description_narrative[narrativeKey] === ''
                            ) {
                                state.responseDocs[index].description_narrative.splice(
                                    narrativeKey,
                                    1
                                );
                                state.responseDocs[index].description_narrative_xml_lang.splice(
                                    narrativeKey,
                                    1
                                );
                            }
                        }
                        // Then proceed to preference locale, if available
                        if (state.responseDocs[index].description_narrative.length > 0) {
                            let langDescriptionNarrative =
                                state.responseDocs[index].description_narrative[0];
                            for (const narrativeKey in state.responseDocs[index]
                                .description_narrative_xml_lang) {
                                if (
                                    state.responseDocs[index].description_narrative_xml_lang[
                                        narrativeKey
                                    ] === state.language
                                ) {
                                    langDescriptionNarrative =
                                        state.responseDocs[index].description_narrative[
                                            narrativeKey
                                        ];
                                    break;
                                }
                            }

                            if (langDescriptionNarrative !== langTitleNarrative) {
                                if (langDescriptionNarrative.split(' ').length > 30) {
                                    langDescriptionNarrative =
                                        langDescriptionNarrative
                                            .split(' ')
                                            .splice(0, 30)
                                            .join(' ') + ' ...';
                                }
                                state.responseDocs[index]['highlighting'] =
                                    langDescriptionNarrative;
                            }
                        }
                    } else {
                        let descriptionNarrative =
                            state.responseDocs[index].description_narrative[0];
                        if (descriptionNarrative.split(' ').length > 30) {
                            descriptionNarrative =
                                descriptionNarrative.split(' ').splice(0, 30).join(' ') + ' ...';
                        }
                        state.responseDocs[index]['highlighting'] = descriptionNarrative;
                    }
                } else {
                    let descriptionNarrative = state.responseDocs[index].description_narrative[0];
                    if (descriptionNarrative.split(' ').length > 30) {
                        descriptionNarrative =
                            descriptionNarrative.split(' ').splice(0, 30).join(' ') + ' ...';
                    }
                    state.responseDocs[index]['highlighting'] = descriptionNarrative;
                }
            }
        }

        index = index + 1;
    }

    state.responseTotal = result.data.response.numFound;
    state.responseStart = result.data.response.start;
    state.numberPages = Math.ceil(state.responseTotal / state.resultsPerPage);
    state.queryInProgress = false;
};

const changeFilter = (id, key, value) => {
    for (let i = 0; i < state.filters.length; i++) {
        if (state.filters[i].id === id) {
            state.filters[i][key] = value;
            // clear validation on all filter changes
            delete state.filters[i].valid;
            delete state.filters[i].validationMessage;

            if (key === 'field') {
                for (let n = 0; n < state.fieldOptions.length; n++) {
                    if (state.fieldOptions[n].label === value) {
                        state.filters[i]['selectedOption'] = state.fieldOptions[n];

                        state.filters[i][key] = state.fieldOptions[n].field;
                        state.filters[i]['desc'] = state.fieldOptions[n].description;
                        state.filters[i]['type'] = state.fieldOptions[n].type;

                        if (state.fieldOptions[n].type === 'date') {
                            state.filters[i]['value'] = startOfToday();
                        }
                        if (state.fieldOptions[n].type === 'combo') {
                            state.filters[i]['value'] = null;
                        }

                        return;
                    }
                }
            }
        }
    }
};

const isFieldOptionSelected = (id, value) => {
    for (let i = 0; i < state.filters.length; i++) {
        if (state.filters[i].id === id && state.filters[i].field === value) {
            return true;
        }
    }
    return false;
};

const isFilterFirstInChain = (id) => {
    if (state.filters[0].id === id) {
        return true;
    } else {
        return false;
    }
};

const filterIsGrouping = (id) => {
    if (state.filters.length <= 1) {
        return false;
    } else {
        let previousIndex = 1;
        for (let i = 1; i < state.filters.length; i++) {
            if (state.filters[i].id === id) {
                previousIndex = i - 1;
                break;
            }
        }
        for (let i = 0; i < state.filters.length; i++) {
            if (
                state.filters[i].value === '(' &&
                state.filters[i].id === state.filters[previousIndex].id
            ) {
                return state.filters[i].type === 'grouping';
            }
            if (state.filters[i].value === ')' && state.filters[i].id === id) {
                return state.filters[i].type === 'grouping';
            }
        }
        return false;
    }
};

const isFieldType = (value, ft) => {
    for (let i = 0; i < state.fieldOptions.length; i++) {
        if (state.fieldOptions[i].field === value) {
            if (state.fieldOptions[i].type === ft) {
                return true;
            } else {
                return false;
            }
        }
    }
};

const isFieldSelected = (id) => {
    for (let i = 0; i < state.filters.length; i++) {
        if (state.filters[i].id === id && state.filters[i].field != null) {
            return true;
        }
    }
};

const dropdownStateBlank = (id) => {
    for (let i = 0; i < state.filters.length; i++) {
        if (state.filters[i].id === id) {
            return state.filters[i].value === '';
        }
    }
};

const validateDropdownOptions = (id, index, options) => {
    for (let i = 0; i < state.filters.length; i++) {
        if (state.filters[i].id === id) {
            const currentValue = state.filters[i].value;
            // If the current field value is null or not in the list of valid options, set blank so "Select code" can be reselected
            if (!options.map((d) => d.code).includes(currentValue) && index === 0) {
                state.filters[i].value = '';
            }
        }
    }
    return false;
};

const loadActivity = async (iatiIdentifier) => {
    let url = baseUrlActivity + 'iati_identifier:' + iatiIdentifier;
    let result = await axios.get(url, axiosConfig);
    state.activity = result.data.response.docs[0];
};

const isFileLoading = () => {
    return state.download.fileLoading;
};

const toggleDownloadModal = (format) => {
    state.download.showModal = !state.download.showModal;
    if (format !== null) {
        state.download.selectedFormat = format;
    } else {
        state.download.selectedFormat = null;
    }
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const statusRequest = async (statusUrl, terminateUrl = null) => {
    if (terminateUrl !== null && state.download.fileLoading === false) {
        return await axios.post(terminateUrl);
    }
    const statusResp = await axios.get(statusUrl);
    if (statusResp.status === 200) {
        return statusResp.data.output;
    } else if (statusResp.status === 202) {
        await sleep(5000);
        return await statusRequest(statusUrl, terminateUrl);
    }
};

const downloadFile = async (format, iid = null, core = 'activity') => {
    if (core != 'activity' && core != 'transaction' && core != 'budget') {
        core = 'activity';
    }

    if (format === 'XML') {
        core = 'activity';
    }

    let query = null;
    let event_label = '';

    if (iid === null) {
        query = core + `/search?sort=iati_identifier asc&q=${state.query}`;
        event_label = state.query;
    } else {
        query = core + `/search?q=iati_identifier:"${iid}"`;
        event_label = iid;
    }

    trackEvent(`Initiated download ${core} ${format}`, {
        props: {
            event_category: 'Download buttons',
            event_label: event_label,
        },
    });

    try {
        state.download.fileLoading = true;

        const startDownloadRes = await axios.post(
            baseUrlDownload,
            {
                query: query,
                format,
            },
            axiosConfig
        );
        await sleep(500);
        const response = await statusRequest(
            startDownloadRes.data.statusQueryGetUri,
            startDownloadRes.data.terminatePostUri
        );
        if ('config' in response && response.config.method === 'post') {
            trackEvent('Cancelled download', {
                props: {
                    event_category: 'Download buttons',
                    event_label: event_label,
                },
            });
            return;
        } else {
            await downloadItem({ url: response.url, label: response.fileName });
            state.download.fileLoading = false;
            toggleDownloadModal(null);
        }
    } catch (error) {
        // If a user cancels right before download finishes, POST returns error 410 GONE. Don't alert user in this case.
        if (state.download.fileLoading === true) {
            alert(`Sorry, an error occurred while downloading your file. Please try again later.`);
            trackEvent(`Error download`, {
                props: {
                    event_category: 'Download buttons',
                    event_label: `Core: ${core}; Format: ${format}; Message: ${error.message}`,
                },
            });
            state.download.fileLoading = false;
        }
    }

    trackEvent(`Succeeded download ${core} ${format}`, {
        props: {
            event_category: 'Download buttons',
            event_label: event_label,
        },
    });
};

const cancelDownloadFile = async () => {
    state.download.fileLoading = false;
    toggleDownloadModal(null);
};

const downloadItem = async ({ url, label }) => {
    const link = document.createElement('a');
    link.download = label;
    link.href = new URL(url);
    link.click();
    URL.revokeObjectURL(link.href);
};

const paginationUpdate = async (page) => {
    state.page = page;

    if (state.simpleSearch) {
        await runSimple(
            state.simpleSearchTerm,
            (state.page - 1) * state.resultsPerPage,
            state.resultsPerPage
        );

        trackEvent('Pagination', {
            props: {
                event_category: 'Simple',
                event_label: `${state.simpleSearchTerm} - ${state.page}`,
            },
        });
    } else {
        await run((state.page - 1) * state.resultsPerPage, state.resultsPerPage);

        trackEvent('Pagination', {
            props: {
                event_category: 'Advanced',
                event_label: `${state.query} - ${state.page}`,
            },
        });
    }
};

const sortResults = async (field) => {
    if (field == state.searchOrderField) {
        state.searchOrderDirection = state.searchOrderDirection == 'desc' ? 'asc' : 'desc';
    } else {
        state.searchOrderField = field;
        const fieldObj = sortFields.filter((d) => d.field == field)[0];
        state.searchOrderDirection = fieldObj.default;
    }

    if (state.simpleSearch) {
        const searchterm = state.simpleSearchTerm;
        await runSimple(searchterm);
    } else {
        await run();
    }
};

const resetResults = () => {
    (state.query = null),
        (state.responseDocs = null),
        (state.responseTotal = null),
        (state.responseStart = null),
        (state.numberPages = null),
        (state.simpleSearch = null),
        (state.simpleSearchTerm = null);
};

const toggleBboxModal = (filterId = null) => {
    if (filterId !== null) {
        state.bbox.filterId = filterId;
    } else {
        state.bbox.filterId = null;
    }
    state.bbox.showModal = !state.bbox.showModal;
};

const setMapBbox = (map) => {
    const bounds = map.getBounds();
    const center = bounds.getCenter();
    state.bbox.zoom = map.getZoom();
    state.bbox.centerLat = center.lat;
    state.bbox.centerLon = center.lng;
    state.bbox.southWestLat = Math.max(Math.min(bounds._southWest.lat, 90), -90);
    state.bbox.northEastLat = Math.max(Math.min(bounds._northEast.lat, 90), -90);
    state.bbox.southWestLon = Math.max(Math.min(bounds._southWest.lng, 180), -180);
    state.bbox.northEastLon = Math.max(Math.min(bounds._northEast.lng, 180), -180);
    state.bbox.displayPrecision = Math.round(1 + ((state.bbox.zoom - 3) / 16) * 5);
};

const applyBbox = () => {
    changeFilter(
        state.bbox.filterId,
        'value',
        `[${state.bbox.southWestLat.toFixed(
            state.bbox.displayPrecision
        )},${state.bbox.southWestLon.toFixed(
            state.bbox.displayPrecision
        )} TO ${state.bbox.northEastLat.toFixed(
            state.bbox.displayPrecision
        )},${state.bbox.northEastLon.toFixed(state.bbox.displayPrecision)}]`
    );

    toggleBboxModal();
};

const changeLocale = (preferred_locale) => {
    if (Object.keys(state.available_locales).includes(preferred_locale)) {
        i18n.global.locale = preferred_locale;
        state.language = preferred_locale;
        localStorage.setItem('language', JSON.stringify(preferred_locale));
        if (state.responseDocs !== null) {
            relocalizeResponseDocs();
        }
    }
};

// Helper functions, not exported:

const relocalizeResponseDocs = () => {
    state.responseDocs.forEach((doc, index) => {
        let langTitleNarrative = '';
        if (
            'title_narrative_xml_lang' in doc &&
            doc.title_narrative_xml_lang.length === doc.title_narrative.length
        ) {
            for (const narrativeKey in doc.title_narrative_xml_lang) {
                if (doc.title_narrative_xml_lang[narrativeKey] === state.language) {
                    langTitleNarrative = doc.title_narrative[narrativeKey];
                    state.responseDocs[index].title_narrative.splice(narrativeKey, 1);
                    state.responseDocs[index].title_narrative.unshift(langTitleNarrative);
                    state.responseDocs[index].title_narrative_xml_lang.splice(narrativeKey, 1);
                    state.responseDocs[index].title_narrative_xml_lang.unshift(state.language);
                    break;
                }
            }
        }
        if ('description_narrative' in doc) {
            if ('description_narrative_xml_lang' in doc) {
                if (
                    doc.description_narrative_xml_lang.length === doc.description_narrative.length
                ) {
                    let langDescriptionNarrative = doc.description_narrative[0];
                    for (const narrativeKey in doc.description_narrative_xml_lang) {
                        if (doc.description_narrative_xml_lang[narrativeKey] === state.language) {
                            langDescriptionNarrative = doc.description_narrative[narrativeKey];
                            break;
                        }
                    }
                    if (langDescriptionNarrative !== langTitleNarrative) {
                        if (langDescriptionNarrative.split(' ').length > 30) {
                            langDescriptionNarrative =
                                langDescriptionNarrative.split(' ').splice(0, 30).join(' ') +
                                ' ...';
                        }
                        state.responseDocs[index]['highlighting'] = langDescriptionNarrative;
                    }
                }
            }
        }
    });
};

const cleanSolrQueryString = (qString) => {
    const stylizedQuotes = ['“', '”', '«', '»'];
    stylizedQuotes.forEach((str) => {
        const reg = new RegExp(str, 'g');
        qString = qString.replace(reg, '"');
    });
    disallowedStrings.forEach((str) => {
        const reg = new RegExp(str, 'g');
        qString = qString.replace(reg, '');
    });
    return qString;
};

const getFilterValue = (filter) => {
    switch (filter['type']) {
        case 'text':
            return `(${cleanSolrQueryString(filter['value'])})`;
        case 'combo':
            return `(${cleanSolrQueryString(filter['value'])})`;
        case 'date':
            return `${format(filter['value'], 'yyyy-MM-dd')}T00:00:00Z`;
        default:
            return filter['value'];
    }
};

const compileQuery = () => {
    let query = '';

    let firstFilter = true;
    let joinOperator = '';

    for (const filterIndex in state.filters) {
        const filter = state.filters[filterIndex];

        if (firstFilter) {
            firstFilter = false;
        } else {
            joinOperator = ' ' + filter.joinOperator + ' ';
        }

        if (!filterIsGrouping(filter.id)) {
            query = query + joinOperator;
        }

        const queryValue = getFilterValue(filter);

        if (
            filter['type'] === 'date' ||
            filter['type'] === 'number' ||
            filter['type'] === 'integer'
        ) {
            switch (filter['operator']) {
                case 'equals':
                    // needs to be encasulated in "" for equals
                    query = query + filter['field'] + ':"' + queryValue + `"`;
                    break;
                case 'lessThan':
                    query = query + filter['field'] + ':[ * TO ' + queryValue + ']';
                    break;
                case 'greaterThan':
                    query = query + filter['field'] + ':[' + queryValue + ' TO * ]';
                    break;
                default:
                    break;
            }
        } else if (filter['type'] === 'grouping') {
            query = query + queryValue;
        } else {
            switch (filter['operator']) {
                case 'equals':
                    query = query + filter['field'] + ':' + queryValue;
                    break;
                case 'notEquals':
                    query = query + '(*:* -' + filter['field'] + ':' + queryValue + ')';
                    break;
                default:
                    break;
            }
        }
    }

    state.query = query;
};

// And export the state and API implementation:
export default {
    state: readonly(state),
    addFilter,
    setFilters,
    removeFilter,
    changeFilter,
    loadActivity,
    isFieldType,
    isFieldSelected,
    isFieldOptionSelected,
    isFilterFirstInChain,
    filterIsGrouping,
    importFilters,
    exportFilters,
    run,
    runSimple,
    isFileLoading,
    downloadFile,
    cancelDownloadFile,
    toggleDownloadModal,
    toggleExportModal,
    toggleImportModal,
    paginationUpdate,
    onFilePicked,
    dropdownStateBlank,
    validateDropdownOptions,
    sortFields,
    sortResults,
    importSimpleSearchToAdv,
    resetResults,
    toggleBboxModal,
    setMapBbox,
    applyBbox,
    changeLocale,
};
