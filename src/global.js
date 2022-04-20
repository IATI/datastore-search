//Simple global state and API management
import { reactive, readonly } from "vue";
import axios from "axios";
import { event } from "vue-gtag";
import { startOfToday, format } from "date-fns";

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
  "/dss/activity/select?wt=json&fl=id,title_narrative,description_narrative,iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative";
const baseUrlSimple =
  domain +
  "/dss/activity/search?wt=json&fl=id,title_narrative,description_narrative,iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative";
const baseUrlActivity =
  domain +
  "/dss/activity/select?wt=json&sort=iati_identifier asc&fl=title_narrative,description_narrative,iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&rows=1&hl=true&hl.method=unified&hl.fl=*_narrative&q=";
const baseUrlDownload = domain + "/dss/download";

const state = reactive({
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
    formats: ["XML", "JSON", "CSV", "XLSX"],
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
  state.import.fileLoading = true;
  await populateOptions();
  state.filters = [...state.import.file];
  state.nextFilterId = state.filters.length;
  state.import.fileLoading = false;
  state.import.disabled = true;
  toggleImportModal();
  event("Imported Filters", {
    method: "Google",
    event_category: "Advanced",
  });
};

const stageFilter = (event) => {
  // TODO - add validation here
  state.import.file = JSON.parse(event.target.result);
  state.import.disabled = false;
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
  const blob = new Blob([JSON.stringify(state.filters)], {
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
    let result = await axios.get(url, axiosConfig);
    state.simpleSearch = false;

    setResponseState(result);
  }
  if (start === 0) {
    event("Run query", {
      method: "Google",
      event_category: "Advanced",
      event_label: state.query,
    });
  }
};

const runSimple = async (searchterm, start = 0, rows = 10) => {
  state.queryInProgress = true;
  state.responseTotal = null;
  state.query = null;

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
      // clear validation if value is present
      if (key === "value" && value !== "") {
        delete state.filters[i].valid;
        delete state.filters[i].validationMessage;
      }

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
      if (
        (currentValue === null ||
          !options.map((d) => d.code).includes(currentValue)) &&
        index === 0
      ) {
        delete state.filters[i].valid;
        delete state.filters[i].validationMessage;
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

const statusRequest = async (url) => {
  const statusResp = await axios.get(url);
  if (statusResp.status === 200) {
    return statusResp.data.output;
  } else if (statusResp.status === 202) {
    await sleep(5000);
    return await statusRequest(url);
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
      startDownloadRes.data.statusQueryGetUri
    );
    await downloadItem({ url: response.url, label: response.fileName });
    state.download.fileLoading = false;
    toggleDownloadModal(null);
  } catch (error) {
    console.error(error);
    alert(`Download Failed: ${error.message}`);
    state.download.fileLoading = false;
  }

  event(`Succeeded download ${core} ${format}`, {
    method: "Google",
    event_category: "Download buttons",
    event_label: event_label,
  });
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
  } else {
    await run((state.page - 1) * state.resultsPerPage, state.resultsPerPage);

    event("Pagination", {
      method: "Google",
      event_category: "Advanced",
      event_label: `${state.query} - ${state.page}`,
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

// Helper functions, not exported:

const cleanSolrQueryString = (qString) => {
  disallowedStrings.forEach((str) => {
    const reg = new RegExp(str, "g");
    qString = qString.replace(reg, "");
  });
  return qString;
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

    query = query + joinOperator;

    if (filter["type"] === "date") {
      let value = `${format(filter["value"], "yyyy-MM-dd")}T00:00:00Z`;

      switch (filter["operator"]) {
        case "equals":
          // needs to be encasulated in "" for equals
          query = query + filter["field"] + ':"' + value + `"`;
          break;
        case "lessThan":
          query = query + filter["field"] + ":[ * TO " + value + "]";
          break;
        case "greaterThan":
          query = query + filter["field"] + ":[" + value + " TO * ]";
          break;
        default:
          break;
      }
    } else {
      // don't wrap value in "" for boolean
      const queryValue =
        filter["type"] === "boolean"
          ? filter["value"]
          : `(${cleanSolrQueryString(filter["value"])})`;
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
  importFilters,
  exportFilters,
  run,
  runSimple,
  isFileLoading,
  downloadFile,
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
};
