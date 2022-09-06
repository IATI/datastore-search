//Simple global state and API management
import { reactive, readonly, toRaw } from "vue";
import axios from "axios";
import { event } from "vue-gtag";
import { startOfToday, format } from "date-fns";
import MD5 from "crypto-js/md5";
import Plausible from "plausible-tracker";
import L from "leaflet";
import "leaflet.markercluster";

const { trackEvent } = Plausible();

const axiosConfig = {
  headers: {
    "Ocp-Apim-Subscription-Key": import.meta.env.VUE_ENV_APIM_API_KEY,
  },
};

const activityDateTypes = {
  planned_start: "1",
  actual_start: "2",
  planned_end: "3",
  actual_end: "4",
};

const sortFields = [
  {
    verbose: "Relevance",
    field: "score",
    label: "Sort results by relevance",
    default: "desc",
  },
  {
    verbose: "Identifier",
    field: "iati_identifier",
    label: "Sort results by IATI identifier",
    default: "asc",
  },
];

const domain = import.meta.env.VUE_ENV_APIM_DOMAIN;

const baseUrl =
  domain +
  "/dss/activity/select?wt=json&fl=id,title_narrative,title_narrative_xml_lang,description_narrative,description_narrative_xml_lang,iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative";
const baseUrlSimple =
  domain +
  "/dss/activity/search?wt=json&fl=id,title_narrative,title_narrative_xml_lang,description_narrative,description_narrative_xml_lang,iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative";
const baseUrlActivity =
  domain +
  "/dss/activity/select?wt=json&sort=iati_identifier asc&fl=title_narrative,title_narrative_xml_lang,description_narrative,description_narrative_xml_lang,iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&rows=1&hl=true&hl.method=unified&hl.fl=*_narrative&q=";
const baseUrlDownload = domain + "/dss/download";
const spatialQueryUrl =
  domain +
  "/dss/activity/select?wt=json&rows=1000&fl=iati_identifier,title_narrative,location_point_latlon&q=*:*&fq=location_point_latlon:";

const state = reactive({
  language: "en",
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
  searchOrderField: "score",
  searchOrderDirection: "desc",
  activity: null,
  download: {
    formats: ["XML", "JSON", "CSV", "EXCEL"],
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
  codelistURL: import.meta.env.VUE_ENV_CODELIST_URL,
  responseErrorMessage: "",
});

const allNarrativesOption = {
  field: "iati_text",
  label: "All Narratives",
  type: "text",
  description: "Searches all IATI narrative fields, used by simple search",
  name: "narrative",
  path: "iati-activities/iati-activity//narrative",
  xsd_type: "",
  solr_required: "false",
  solr_multivalued: "true",
};

const groupingOption = {
  field: "()",
  label: "Boolean Grouping",
  type: "grouping",
  description:
    "Parenthesis for grouping boolean queries. Ensure every opening parenthesis is matched with a closing parenthesis.",
  name: "",
  path: "",
  xsd_type: "",
  solr_required: "false",
  solr_multivalued: "false",
};

const populateOptions = async () => {
  let filterOptions = null;

  let response = await axios.get(
    `${domain}/dss/resources/filters`,
    axiosConfig
  );

  filterOptions = response.data;

  response = await axios.get(`${domain}/dss/resources/codelists`, axiosConfig);

  const codelists = response.data;

  for (const index in filterOptions) {
    if (filterOptions[index].type === "select") {
      // remove versions 1.X from dataset_version field
      if (filterOptions[index].field === "dataset_version") {
        filterOptions[index]["options"] = codelists[
          filterOptions[index].codelist_name
        ].data.filter((codeObj) => !codeObj.code.includes("1."));
      } else {
        filterOptions[index]["options"] =
          codelists[filterOptions[index].codelist_name].data;
      }
      filterOptions[index].codelistMeta =
        codelists[filterOptions[index].codelist_name].metadata;
    }
  }

  const specialOptions = [
    {
      field: "",
      label: "Special fields:",
      disabled: true,
    },
    { ...allNarrativesOption },
    {
      field: "",
      label: "Grouping:",
      disabled: true,
    },
    { ...groupingOption },
    {
      field: "",
      label: "Standard fields:",
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
  const filterId = "filter-" + state.nextFilterId;
  state.nextFilterId = state.nextFilterId + 1;
  state.filters.push({
    id: filterId,
    type: null,
    field: null,
    value: null,
    operator: "equals",
    joinOperator: "AND",
  });
  return filterId;
};

const removeFilter = (id) => {
  state.filters = state.filters.filter(function (filter) {
    return filter.id !== id;
  });
};

export const importSimpleSearchToAdv = async () => {
  state.filters = [
    {
      id: "filter-0",
      type: allNarrativesOption.type,
      field: allNarrativesOption.field,
      value: state.query,
      operator: "equals",
      joinOperator: "AND",
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
      if (state.filters[i].type === "date") {
        state.filters[i].value = new Date(state.filters[i].value);
      }
    }

    const lastFilterId = state.filters
      .map((d) => parseInt(d.id.split("-")[1], 10))
      .sort(function (a, b) {
        return a - b;
      })[state.filters.length - 1];
    state.nextFilterId = lastFilterId + 1;
    state.import.disabled = true;
    toggleImportModal();
    event("Imported Filters", {
      method: "Google",
      event_category: "Advanced",
    });
    trackEvent("Imported Filters", {
      props: {
        event_category: "Advanced",
      },
    });
  } else {
    state.import.errors.push(
      "Incompatible file detected. Please try importing a different file."
    );
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
    state.import.errors.push(
      "Incompatible file detected. Please try choosing a different file."
    );
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
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `IATI_Datastore_Search_Filters_${date.toISOString()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  state.export.fileLoading = false;
  state.export.showModal = false;
  event("Exported Filters", {
    method: "Google",
    event_category: "Advanced",
  });
  trackEvent("Exported Filters", {
    props: {
      event_category: "Advanced",
    },
  });
};

// don't allow use of Functions in DSS
const disallowedStrings = ["{!func}", "_val_"];

const validateFilters = () => {
  let count = 0;
  state.filters = state.filters.map((filter) => {
    // require input value check
    if (filter.value === null || filter.value === "") {
      switch (filter.type) {
        case "text":
          count += 1;
          return {
            ...filter,
            valid: false,
            validationMessage: "Search term is required",
          };
        case "boolean":
          count += 1;
          return {
            ...filter,
            valid: false,
            validationMessage: "Selection is required",
          };
        case "grouping":
          count += 1;
          return {
            ...filter,
            valid: false,
            validationMessage: "Selection is required",
          };
        case "number":
          count += 1;
          return {
            ...filter,
            valid: false,
            validationMessage: "A value is required",
          };
        case "integer":
          count += 1;
          return {
            ...filter,
            valid: false,
            validationMessage: "A value is required",
          };
        case "date":
          count += 1;
          return {
            ...filter,
            valid: false,
            validationMessage: "A date is required",
          };
        case "select":
          count += 1;
          return {
            ...filter,
            valid: false,
            validationMessage: "A selection is required",
          };
        default:
          break;
      }
    }

    // Disallowed strings to prevent Solr Function queries
    if (filter.type === "text") {
      const badStrs = disallowedStrings.reduce((acc, str) => {
        if (filter.value.includes(str)) {
          acc.push(str);
        }
        return acc;
      }, []);

      if (badStrs.length > 0) {
        count += 1;
        return {
          ...filter,
          valid: false,
          validationMessage: `${badStrs.join()} is not allowed for datastore search queries`,
        };
      }
    }

    // percentages 0 to 100 check
    if (
      filter.type === "number" &&
      filter.field.includes("_percentage") &&
      (filter.value < 0 || filter.value > 100)
    ) {
      count += 1;
      return {
        ...filter,
        valid: false,
        validationMessage: "Percentage must be between 0 and 100",
      };
    }
    // integer check
    if (filter.type === "integer" && !Number.isInteger(filter.value)) {
      count += 1;
      return {
        ...filter,
        valid: false,
        validationMessage: "Value must be a whole number",
      };
    }
    return { ...filter };
  });
  return count === 0;
};

const run = async (start = 0, rows = 10) => {
  state.responseTotal = null;
  state.query = null;
  state.responseErrorMessage = "";

  if (validateFilters()) {
    state.queryInProgress = true;
    await compileQuery();
    let url = new URL(baseUrl);
    url.searchParams.set("q", state.query);
    url.searchParams.set("start", start);
    url.searchParams.set("rows", rows);
    url.searchParams.set(
      "sort",
      `${state.searchOrderField} ${state.searchOrderDirection}`
    );
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
      state.responseErrorMessage =
        "There was an error fetching your query. Please check how your query is constructed and try again.";
    }

    state.simpleSearch = false;

    setResponseState(result);
  }
  if (start === 0) {
    event("Run query", {
      method: "Google",
      event_category: "Advanced",
      event_label: state.query,
    });
    trackEvent("Run query", {
      props: {
        event_category: "Advanced",
        event_label: state.query,
      },
    });
  }
};

const runSimple = async (searchterm, start = 0, rows = 10) => {
  state.queryInProgress = true;
  state.responseTotal = null;
  state.query = null;
  state.responseErrorMessage = "";

  // Clean search term to prevent Solr Function Queries
  const cleanSearchTerm = cleanSolrQueryString(searchterm);

  state.simpleSearchTerm = cleanSearchTerm;
  let url = new URL(baseUrlSimple);
  url.searchParams.set("q", cleanSearchTerm);
  url.searchParams.set("start", start);
  url.searchParams.set("rows", rows);
  url.searchParams.set(
    "sort",
    `${state.searchOrderField} ${state.searchOrderDirection}`
  );
  let result = await axios.get(url, axiosConfig);
  state.simpleSearch = true;
  state.query = cleanSearchTerm;
  state.responseTotal = null;
  setResponseState(result);

  if (start === 0) {
    event("Run query", {
      method: "Google",
      event_category: "Simple",
      event_label: state.query,
    });
    trackEvent("Run query", {
      props: {
        event_category: "Simple",
        event_label: state.query,
      },
    });
  }
};

const setResponseState = (result) => {
  state.responseDocs = result.data.response.docs;

  for (const keyA in state.responseDocs) {
    for (const keyB in state.responseDocs[keyA]["activity_date_type"]) {
      const dt = state.responseDocs[keyA]["activity_date_iso_date"][keyB];

      switch (state.responseDocs[keyA]["activity_date_type"][keyB]) {
        case activityDateTypes.planned_start:
          state.responseDocs[keyA]["plannedStart"] = dt;
          break;
        case activityDateTypes.actual_start:
          state.responseDocs[keyA]["actualStart"] = dt;
          break;
        case activityDateTypes.planned_end:
          state.responseDocs[keyA]["plannedEnd"] = dt;
          break;
        case activityDateTypes.actual_end:
          state.responseDocs[keyA]["actualEnd"] = dt;
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

    state.responseDocs[index]["highlighting"] = "";

    for (const prop in result.data.highlighting[keyA]) {
      state.responseDocs[index]["highlighting"] =
        state.responseDocs[index]["highlighting"] +
        '"' +
        result.data.highlighting[keyA][prop] +
        '" ... ';
    }

    state.responseDocs[index]["highlighting"] = state.responseDocs[index][
      "highlighting"
    ].substring(0, state.responseDocs[index]["highlighting"].length - 5);

    state.responseDocs[index]["highlighting"] = state.responseDocs[index][
      "highlighting"
    ].replaceAll('",', '"');

    if ("title_narrative" in state.responseDocs[index]) {
      if ("title_narrative_xml_lang" in state.responseDocs[index]) {
        for (const narrativeKey in state.responseDocs[index]
          .title_narrative_xml_lang) {
          if (
            state.responseDocs[index].title_narrative_xml_lang[narrativeKey] ===
            state.language
          ) {
            const langTitleNarrative =
              state.responseDocs[index].title_narrative[narrativeKey];
            state.responseDocs[index].title_narrative.splice(narrativeKey, 1);
            state.responseDocs[index].title_narrative.unshift(
              langTitleNarrative
            );
            break;
          }
        }
      }
    }

    if (state.responseDocs[index]["highlighting"] === "") {
      if ("description_narrative" in state.responseDocs[index]) {
        if ("description_narrative_xml_lang" in state.responseDocs[index]) {
          for (const narrativeKey in state.responseDocs[index]
            .description_narrative_xml_lang) {
            if (
              state.responseDocs[index].description_narrative_xml_lang[
                narrativeKey
              ] === state.language
            ) {
              let langDescriptionNarrative =
                state.responseDocs[index].description_narrative[narrativeKey];
              if ("title_narrative" in state.responseDocs[index]) {
                if (
                  langDescriptionNarrative !==
                  state.responseDocs[index].title_narrative[0]
                ) {
                  if (langDescriptionNarrative.split(" ").length > 30) {
                    langDescriptionNarrative =
                      langDescriptionNarrative
                        .split(" ")
                        .splice(0, 30)
                        .join(" ") + " ...";
                  }
                  state.responseDocs[index]["highlighting"] =
                    langDescriptionNarrative;
                }
              }
              break;
            }
          }
        } else {
          let descriptionNarrative =
            state.responseDocs[index].description_narrative[0];
          if (descriptionNarrative.split(" ").length > 30) {
            descriptionNarrative =
              descriptionNarrative.split(" ").splice(0, 30).join(" ") + " ...";
          }
          state.responseDocs[index]["highlighting"] = descriptionNarrative;
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

      if (key === "field") {
        for (let n = 0; n < state.fieldOptions.length; n++) {
          if (state.fieldOptions[n].label === value) {
            state.filters[i]["selectedOption"] = state.fieldOptions[n];

            state.filters[i][key] = state.fieldOptions[n].field;
            state.filters[i]["desc"] = state.fieldOptions[n].description;
            state.filters[i]["type"] = state.fieldOptions[n].type;

            if (state.fieldOptions[n].type === "date") {
              state.filters[i]["value"] = startOfToday();
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
        state.filters[i].value === "(" &&
        state.filters[i].id === state.filters[previousIndex].id
      ) {
        return state.filters[i].type === "grouping";
      }
      if (state.filters[i].value === ")" && state.filters[i].id === id) {
        return state.filters[i].type === "grouping";
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
      return state.filters[i].value === "";
    }
  }
};

const validateDropdownOptions = (id, index, options) => {
  for (let i = 0; i < state.filters.length; i++) {
    if (state.filters[i].id === id) {
      const currentValue = state.filters[i].value;
      // If the current field value is null or not in the list of valid options, set blank so "Select code" can be reselected
      if (!options.map((d) => d.code).includes(currentValue) && index === 0) {
        state.filters[i].value = "";
      }
    }
  }
  return false;
};

const loadActivity = async (iatiIdentifier) => {
  let url = baseUrlActivity + "iati_identifier:" + iatiIdentifier;
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

const downloadFile = async (format, iid = null, core = "activity") => {
  if (core != "activity" && core != "transaction" && core != "budget") {
    core = "activity";
  }

  if (format === "XML") {
    core = "activity";
  }

  let query = null;
  let event_label = "";

  if (iid === null) {
    query = core + `/search?sort=iati_identifier asc&q=${state.query}`;
    event_label = state.query;
  } else {
    query = core + `/search?q=iati_identifier:"${iid}"`;
    event_label = iid;
  }

  event(`Initiated download ${core} ${format}`, {
    method: "Google",
    event_category: "Download buttons",
    event_label: event_label,
  });
  trackEvent(`Initiated download ${core} ${format}`, {
    props: {
      event_category: "Download buttons",
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
    if ("config" in response && response.config.method === "post") {
      event("Cancelled download", {
        method: "Google",
        event_category: "Download buttons",
        event_label: event_label,
      });
      trackEvent("Cancelled download", {
        props: {
          event_category: "Download buttons",
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
      console.error(error);
      alert(`Download Failed: ${error.message}`);
      state.download.fileLoading = false;
    }
  }

  event(`Succeeded download ${core} ${format}`, {
    method: "Google",
    event_category: "Download buttons",
    event_label: event_label,
  });
  trackEvent(`Succeeded download ${core} ${format}`, {
    props: {
      event_category: "Download buttons",
      event_label: event_label,
    },
  });
};

const cancelDownloadFile = async () => {
  state.download.fileLoading = false;
  toggleDownloadModal(null);
};

const downloadItem = async ({ url, label }) => {
  const link = document.createElement("a");
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

    event("Pagination", {
      method: "Google",
      event_category: "Simple",
      event_label: `${state.simpleSearchTerm} - ${state.page}`,
    });
    trackEvent("Pagination", {
      props: {
        event_category: "Simple",
        event_label: `${state.simpleSearchTerm} - ${state.page}`,
      },
    });
  } else {
    await run((state.page - 1) * state.resultsPerPage, state.resultsPerPage);

    event("Pagination", {
      method: "Google",
      event_category: "Advanced",
      event_label: `${state.query} - ${state.page}`,
    });
    trackEvent("Pagination", {
      props: {
        event_category: "Advanced",
        event_label: `${state.query} - ${state.page}`,
      },
    });
  }
};

const sortResults = async (field) => {
  if (field == state.searchOrderField) {
    state.searchOrderDirection =
      state.searchOrderDirection == "desc" ? "asc" : "desc";
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

const updateMap = async (proxyMap, tile) => {
  const map = toRaw(proxyMap);
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
  });
  map.addLayer(toRaw(tile));
  const bounds = map.getBounds();
  const SolrBounds = `[${bounds._southWest.lat},${bounds._southWest.lng} TO ${bounds._northEast.lat},${bounds._northEast.lng}]`;
  let result = await axios.get(spatialQueryUrl + SolrBounds, axiosConfig);
  const markers = L.markerClusterGroup();
  result.data.response.docs.forEach((activity) => {
    const points = activity.location_point_latlon;
    points.forEach((point) => {
      const lat = point.split(",")[0];
      const lon = point.split(",")[1];
      markers.addLayer(
        L.marker([lat, lon]).bindPopup(
          "<b>Title: </b><a href='/activity/" +
            window
              .encodeURIComponent(activity.iati_identifier)
              .replace("/", "%2F") +
            "'>" +
            activity.title_narrative +
            "</a>"
        )
      );
    });
  });
  map.addLayer(toRaw(markers));
};

// Helper functions, not exported:

const cleanSolrQueryString = (qString) => {
  disallowedStrings.forEach((str) => {
    const reg = new RegExp(str, "g");
    qString = qString.replace(reg, "");
  });
  return qString;
};

const getFilterValue = (filter) => {
  switch (filter["type"]) {
    case "text":
      return `(${cleanSolrQueryString(filter["value"])})`;
    case "date":
      return `${format(filter["value"], "yyyy-MM-dd")}T00:00:00Z`;
    default:
      return filter["value"];
  }
};

const compileQuery = () => {
  let query = "";

  let firstFilter = true;
  let joinOperator = "";

  for (const filterIndex in state.filters) {
    const filter = state.filters[filterIndex];

    if (firstFilter) {
      firstFilter = false;
    } else {
      joinOperator = " " + filter.joinOperator + " ";
    }

    if (!filterIsGrouping(filter.id)) {
      query = query + joinOperator;
    }

    const queryValue = getFilterValue(filter);

    if (filter["type"] === "date") {
      switch (filter["operator"]) {
        case "equals":
          // needs to be encasulated in "" for equals
          query = query + filter["field"] + ':"' + queryValue + `"`;
          break;
        case "lessThan":
          query = query + filter["field"] + ":[ * TO " + queryValue + "]";
          break;
        case "greaterThan":
          query = query + filter["field"] + ":[" + queryValue + " TO * ]";
          break;
        default:
          break;
      }
    } else if (filter["type"] === "grouping") {
      query = query + queryValue;
    } else {
      switch (filter["operator"]) {
        case "equals":
          query = query + filter["field"] + ":" + queryValue;
          break;
        case "notEquals":
          query = query + "-" + filter["field"] + ":" + queryValue;
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
  updateMap,
};
