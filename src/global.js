//Simple global state and API management
import { reactive, readonly } from "vue";

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
  state.filters.push({id: 'filter-' + state.nextFilterId, field: null, value: null, operator: 'equals'})
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
  alert('Yet to be implemented');
}

const changeFilter = (id, key, value) => {
  for (let i=0; i<state.filters.length; i++) {
    if (state.filters[i].id === id) {
      state.filters[i][key] = value;

      if (key === 'field') {
        for (let n=0; n<state.fieldOptions.length; n++) {
          if (state.fieldOptions[n].label === value) {
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

const fieldType = (value) => {
  for (let i=0; i<state.fieldOptions.length; i++) {
    if (state.fieldOptions[i].label === value) {
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

const makeRequest = () => {
  generateRequest()
  //@todo
}

// Helper functions, not exported:
const compileRequest = () => {
  //@todo - use the filters to compile a GET request and write that to state.request
}

// And export the state and API implementation:
export default { state: readonly(state), 
  addFilter,
  removeFilter,
  changeFilter,
  makeRequest,
  fieldType,
  isFieldOptionSelected,
  importFilters,
  exportFilters,
  run,
  downloadCSV,
  downloadJSON,
  downloadXML,
  paginationUpdate
  };