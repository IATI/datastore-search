//Simple global state and API management
import { reactive, readonly } from "vue";

const state = reactive({
  nextFilterId: 0,
  filters: [],
  fieldOptions: [
  {'field': 'description_narrative', 'label':'Description Narrative', 'type':'text'},
  {'field': 'reporting_org', 'label':'Reporting Org', 'type':'select', 'options':
    [{'value':'org_1', label:'Org One'},
    {'value':'org_2', label:'Org Two'},
    {'value':'org_3', label:'Org Three'}]},
  {'field': 'activity_date', 'label':'Activity Date', 'type':'date'}],
  request: null, //A HTTP GET request compiled from the filters
  response: null //The response received from the DS API after making state.request
});

//API implementation, and then exported:
const addFilter = () => {
  state.filters.push({id: 'filter-' + state.nextFilterId, field: null})
  state.nextFilterId = state.nextFilterId + 1;
}

const removeFilter = (id) => {
  state.filters = state.filters.filter(function( filter ) {
    return filter.id !== id;
  });
}

const changeFilter = (id, key, value) => {
  for (let i=0; i<state.filters.length; i++) {
    if (state.filters[i].id === id) {
      state.filters[i][key] = value;
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

const fieldType = (field) => {
  console.log(field);
  for (let i=0; i<state.fieldOptions.length; i++) {
    if (state.fieldOptions[i].field === field) {
      return state.fieldOptions[i].type
    }
  }
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
  isFieldOptionSelected
  };