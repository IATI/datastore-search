//Simple global state and API management
import { reactive, readonly } from "vue";
import axios from 'axios'


const axiosConfig = {
  headers: {
    'Ocp-Apim-Subscription-Key': 'fbaac107c5754bd1a5d67448bc52ce47',
  }
}

const baseUrl = "https://dev-api.iatistandard.org/dss/activity/select?wt=json&sort=iati_identifier asc&fl=title_narrative,description_narrative,iati_identifier,last_updated_datetime,reporting_org_narrative&rows=10&q=";

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
  response: null, //The response received from the DS API after making query,
  page: null
});

//API implementation, and then exported:
const addFilter = () => {
  state.filters.push({id: 'filter-' + state.nextFilterId, type: null, field: null, value: null, operator: 'equals', joinOperator: 'AND'})
  state.nextFilterId = state.nextFilterId + 1;
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

const run = async () => {
  await compileQuery();
  let url = baseUrl + state.query
  let result = await axios.get(url, axiosConfig);
  state.response = result.response;  
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

const downloadXML = () => {
  alert('Yet to be implemented');
}

const downloadJSON = () => {
  alert('Yet to be implemented');
}

const downloadCSV = () => {
  alert('Yet to be implemented');
}

const paginationUpdate = (page) => {
  state.page = page;
}

const makeRequest = async () => {

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
  makeRequest,
  fieldType,
  isFieldOptionSelected,
  isFilterFirstInChain,
  importFilters,
  exportFilters,
  run,
  downloadCSV,
  downloadJSON,
  downloadXML,
  paginationUpdate
  };