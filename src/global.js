//Simple global state and API management
import { reactive, readonly } from "vue";
import axios from 'axios';

const axiosConfig = {
  headers: {
    'Ocp-Apim-Subscription-Key': 'fbaac107c5754bd1a5d67448bc52ce47',
  }
}

const baseUrl = "https://dev-api.iatistandard.org/dss/activity/select?wt=json&sort=iati_identifier asc&fl=id,title_narrative,description_narrative,iati_identifier,last_updated_datetime,reporting_org_narrative&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative";
const baseUrlSimple = "https://dev-api.iatistandard.org/dss/activity/search?wt=json&sort=iati_identifier asc&fl=id,title_narrative,description_narrative,iati_identifier,last_updated_datetime,reporting_org_narrative&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative";
const baseUrlActivity = "https://dev-api.iatistandard.org/dss/activity/select?wt=json&sort=iati_identifier asc&fl=title_narrative,description_narrative,iati_identifier,last_updated_datetime,reporting_org_narrative&rows=1&hl=true&hl.method=unified&hl.fl=*_narrative&q=";
const baseUrlDownload = "https://dev-api.iatistandard.org/dss/download"

const state = reactive({
  nextFilterId: 0,
  filters: [],
  fieldOptions: null,
  query: null, //A Solr query string compiled from the filters
  responseDocs: null, //The array of Solr docs received from the DS API after making query,
  responseTotal: null, //Total number of docs in response
  responseStart: null, //The start offset of the response, which should be in multiples of resultsPerPage
  resultsPerPage: 10, //results shown per page of UI
  numberPages: null, // Total number of pages responseTotal/resultsPerPage
  page: 1,
  simpleSearch: null,
  simpleSearchTerm: null,
  activity: null,
  download: {
    formats: ['XML', 'JSON', 'CSV'],
    fileLoading: false,
    showModal: false,
    selectedFormat: null
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
    file: null
  }
});

const populateOptions = async () => {
  const filtersUrl = 'https://raw.githubusercontent.com/IATI/dss-filters/develop/filters.json'
  const codelistsUrl = 'https://raw.githubusercontent.com/IATI/dss-filters/develop/codelists.json';
  
  let filterOptions = null;
  
  let response = await axios.get(filtersUrl);
  
  filterOptions = response.data;
  
  response = await axios.get(codelistsUrl);
  
  const codelists = response.data;

  for (const index in filterOptions) {
    if (filterOptions[index].type === "select") {
      filterOptions[index]['options'] = codelists[filterOptions[index].codelist_name].data;
    }
  }

  state.fieldOptions = filterOptions;          
}

//API implementation, and then exported:
const addFilter = async () => {
  if (state.fieldOptions === null) {
    await populateOptions();
  }

  const filterId = 'filter-' + state.nextFilterId
  state.filters.push({id: filterId, type: null, field: null, value: null, operator: 'equals', joinOperator: 'AND'})
  state.nextFilterId = state.nextFilterId + 1;
  return filterId;
}

const removeFilter = (id) => {
  state.filters = state.filters.filter(function( filter ) {
    return filter.id !== id;
  });
}

export const toggleExportModal = () => {
  state.export.errors = [];
  state.export.showModal = !state.export.showModal
}

export const toggleImportModal = () => {
  state.import.errors = [];
  state.import.showModal = !state.import.showModal
}

const importFilters = () => {
  state.import.fileLoading = true
  state.filters = [...state.import.file]
  state.import.fileLoading = true
  state.import.disabled = true
  toggleImportModal()
}

const stageFilter = (event) => {  
  // TODO - add validation here 
	state.import.file = JSON.parse(event.target.result);
  state.import.disabled = false;
}

export const onFilePicked = (event) => {
  const files = event.target.files
  const reader = new FileReader()
  // Setup the callback event to run when the file is read
	reader.onload = stageFilter;

	// Read the file
	reader.readAsText(files[0]);
}

export const exportFilters = () => {
  const date = new Date()
  state.export.fileLoading = true
  const blob = new Blob([JSON.stringify(state.filters)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `IATI_Datastore_Search_Filters_${date.toISOString()}.json`
  link.click()
  URL.revokeObjectURL(link.href)
  state.export.fileLoading = false
  state.export.showModal = false
}

const validateFilters = () => {
  let count = 0;
  state.filters = state.filters.map((filter) => {
    // require input value
    if (filter.value === null || filter.value === '') {
      count += 1;
      return {...filter, valid: false, validationMessage: "Search term is required"}
    }
    return {...filter}
  })
  return count === 0
}

const run = async (start = 0, rows = 10) => {
  if (validateFilters()) {
    await compileQuery(); 
    let url = new URL(baseUrl);
    url.searchParams.set('q',  state.query)
    url.searchParams.set('start', start);
    url.searchParams.set('rows', rows);
    let result = await axios.get(url, axiosConfig);
    state.simpleSearch = false;
    setResponseState(result);  
  }
}

const runSimple = async (searchterm, start = 0, rows = 10) => {
  state.simpleSearchTerm = searchterm;
  let url = new URL(baseUrlSimple);
  url.searchParams.set('q', searchterm);
  url.searchParams.set('start', start);
  url.searchParams.set('rows', rows);
  let result = await axios.get(url, axiosConfig);
  state.simpleSearch = true;
  state.query = searchterm;
  setResponseState(result);
}

const setResponseState = (result) => {
  state.responseDocs = result.data.response.docs;

  let index = 0;

  for (const keyA in result.data.highlighting) {
    for (const keyB in result.data.highlighting[keyA]) {
      if (result.data.highlighting[keyA][keyB].length < 1) {
        delete result.data.highlighting[keyA][keyB];
      }
    }

    state.responseDocs[index]['highlighting'] = '';

    for (const prop in result.data.highlighting[keyA]) {
      state.responseDocs[index]['highlighting'] = state.responseDocs[index]['highlighting'] + result.data.highlighting[keyA][prop] 
    }

    index = index + 1;
  }

  state.responseTotal = result.data.response.numFound;
  state.responseStart = result.data.response.start;
  state.numberPages = Math.ceil(state.responseTotal / state.resultsPerPage)
}

const changeFilter = (id, key, value) => {
  for (let i=0; i<state.filters.length; i++) {
    if (state.filters[i].id === id) {
      state.filters[i][key] = value;
      // clear validation if value is present
      if (key === 'value' && value !== '') {
        delete state.filters[i].valid
        delete state.filters[i].validationMessage
      }

      if (key === 'field') {
        for (let n=0; n<state.fieldOptions.length; n++) {
          if (state.fieldOptions[n].label === value) {
            state.filters[i]['selectedOption'] = state.fieldOptions[n];

            state.filters[i][key] = state.fieldOptions[n].field;
            state.filters[i]['desc'] = state.fieldOptions[n].description;
            state.filters[i]['type'] = state.fieldOptions[n].type;

            if (state.fieldOptions[n].type === 'date') {
              state.filters[i]['value'] = new Date();
            }

            return;
          }          
        }
      }
    }
  }
}

const isFieldOptionSelected = (id, value) => {
  for (let i=0; i<state.filters.length; i++) {
    if (state.filters[i].id === id && state.filters[i].field === value) {
      return true;
    }
  }
  return false;
}

const isFilterFirstInChain = (id) => {
    if (state.filters[0].id === id) {
      return true;
    } else {
      return false;
    }
}

const isFieldType = (value, ft) => {
  for (let i=0; i<state.fieldOptions.length; i++) {
    if (state.fieldOptions[i].field === value) {
      if (state.fieldOptions[i].type === ft) {
        return true;
      } else {
        return false;
      }
    }
  }
}

const loadActivity = async (iatiIdentifier) => {
  let url = baseUrlActivity + 'iati_identifier:' + iatiIdentifier;
  let result = await axios.get(url, axiosConfig);
  state.activity = result.data.response.docs[0];
}

const isFileLoading = () => {
  return state.download.fileLoading
}

const toggleDownloadModal = (format) => {
  state.download.showModal = !state.download.showModal
  if (format !== null) {
    state.download.selectedFormat = format
  } else {
    state.download.selectedFormat = null
  }
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const statusRequest = async (url) => {
  const statusResp = await axios.get(url)
  if (statusResp.status === 200) {
    return statusResp.data.output
  } else if (statusResp.status === 202) {
    await sleep(5000)
    return await statusRequest(url)

  }
}

const downloadFile = async (format, iid=null) => {
  let query = null;

  if (iid === null) {
    query = `activity/search?sort=iati_identifier asc&q=${state.query}`;
  } else {
    query = `activity/search?q=iati_identifier:"${iid}"`;
  }

  try {
    state.download.fileLoading = true

    const startDownloadRes = await axios.post(baseUrlDownload, {
      query: query,
      format,
    }, axiosConfig);
    await sleep(500)
    const response = await statusRequest(startDownloadRes.data.statusQueryGetUri)
    await downloadItem({ url: response.url, label: response.fileName})
    state.download.fileLoading = false
    toggleDownloadModal(null)
  } catch (error) {
    console.error(error)
    alert(`Download Failed: ${error.message}`)
    state.download.fileLoading = false
  }
}

const downloadItem = async ({ url, label }) => {
  const link = document.createElement("a");
  link.download = label; 
  link.href = new URL(url);
  link.click();
  URL.revokeObjectURL(link.href);
}

const paginationUpdate = async (page) => {
  state.page = page
  if (state.simpleSearch) {
    await runSimple(state.simpleSearchTerm, (page - 1) * state.resultsPerPage, state.resultsPerPage)
  } else {
    await run((page - 1) * state.resultsPerPage, state.resultsPerPage)
  }
}

// Helper functions, not exported:
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

    query = query + joinOperator;

    if (filter['type'] === 'date') {
      let value = filter['value'].toISOString();

      switch(filter['operator']) {
        case 'equals':
          query = query + filter['field'] + ':' + value
        break;
        case 'lessThan':
          query = query + filter['field'] + ':[1970-01-01T00:00:00Z TO ' + value + ']'
        break;
        case 'greaterThan':
          query = query + filter['field'] + ':[' + value + ' TO NOW]'
        break;
        default:
        break;
      }
    } else {
      switch(filter['operator']) {
        case 'equals':
          query = query + filter['field'] + ':"' + filter['value'] + '"'
        break;
        case 'notEquals':
          query = query + '-' + filter['field'] + ':"' + filter['value'] + '"'
        break
        default:
        break;
      }
    }
  }

  state.query = query;
}

// And export the state and API implementation:
export default { state: readonly(state), 
  addFilter,
  removeFilter,
  changeFilter,
  loadActivity,
  isFieldType,
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
  onFilePicked
  };