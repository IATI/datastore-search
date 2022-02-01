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
  fieldOptions: [
  {'field': 'description_narrative', 'label':'Description Narrative', 'type':'text', 'desc':'A natural language description.'},
  {'field': 'reporting_org', 'label':'Reporting Org', 'type':'select', 'desc':'The organisation that reported the Activity.', 'options':
    [{'value':'org_1', label:'Org One'},
    {'value':'org_2', label:'Org Two'},
    {'value':'org_3', label:'Org Three'}]},
  {'field': 'activity_date', 'label':'Activity Date', 'type':'date', 'desc':'The date of the activity'}],
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
  }
});

//API implementation, and then exported:
const addFilter = () => {
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

const importFilters = () => {
  alert('Yet to be implemented');
}

const exportFilters = () => {
  alert('Yet to be implemented');
}

const run = async (start = 0, rows = 10) => {
  await compileQuery(); 
  let url = new URL(baseUrl);
  url.searchParams.set('q',  state.query)
  url.searchParams.set('start', start);
  url.searchParams.set('rows', rows);
  let result = await axios.get(url, axiosConfig);
  state.simpleSearch = false;
  setResponseState(result);  
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

      if (key === 'field') {
        for (let n=0; n<state.fieldOptions.length; n++) {
          if (state.fieldOptions[n].label === value) {
            state.filters[i][key] = state.fieldOptions[n].field;
            state.filters[i]['desc'] = state.fieldOptions[n].desc;
            state.filters[i]['type'] = state.fieldOptions[n].type;

            if (state.fieldOptions[n].type === 'date') {
              state.filters[i]['value'] = new Date();
            }
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

const fieldType = (value) => {
  for (let i=0; i<state.fieldOptions.length; i++) {
    if (state.fieldOptions[i].field === value) {
      return state.fieldOptions[i].type
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

const toggleModal = (format) => {
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
    toggleModal(null)
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
          query = query + filter['field'] + ':[1970-01-01T00:00:00Z TO ' + value
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
  fieldType,
  isFieldOptionSelected,
  isFilterFirstInChain,
  importFilters,
  exportFilters,
  run,
  runSimple,
  isFileLoading,
  downloadFile,
  toggleModal,
  paginationUpdate
  };