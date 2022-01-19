//Simple global state and API management
import { reactive, readonly } from "vue";
import { axios } from "axios";

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
  request: null, //A HTTP GET request compiled from the filters
  response: null, //The response received from the DS API after making state.request,
  page: null
});

//API implementation, and then exported:
const addFilter = () => {
  state.filters.push({id: 'filter-' + state.nextFilterId, field: null, value: null, operator: 'equals', joinOperator: 'AND'})
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

const run = () => {
  alert(compileRequest());  
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
  compileRequest()
  let result = await axios(compileRequest());
  state.response = result.response;
}

// Helper functions, not exported:
const compileRequest = () => {
  let url = "https://dev-api.iatistandard.org/dss/activity/select?wt=json&sort=iati_identifier asc&fl=title_narrative,description_narrative,iati_identifier,last_updated_datetime,reporting_org_narrative&rows=10&q=";  
  
  let firstFilter = true;
  let joinOperator = '';

  for (const filterIndex in state.filters) {
    const filter = state.filters[filterIndex];

    if (firstFilter) {
      firstFilter = false;
    } else {
      joinOperator = ' ' + filter.joinOperator + ' ';
    }

    url = url + joinOperator;

    if (filter['type'] === 'date') {
      switch(filter['operator']) {
        case 'equals':
          url = url + filter['field'] + ':' + filter['value']
        break;
        case 'lessThan':
          url = url + filter['field'] + ':[1970-01-01T00:00:00Z TO ' + filter['value']
        break
        case 'greaterThan':
          url = url + filter['field'] + ':[' + filter['value'] + ' TO NOW]'
        break
        default:
        break;
      }
    } else {
      switch(filter['operator']) {
        case 'equals':
          url = url + filter['field'] + ':"' + filter['value'] + '"'
        break;
        case 'notEquals':
          url = url + '-' + filter['field'] + ':"' + filter['value'] + '"'
        break
        default:
        break;
      }
    }
  }

  return url;
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