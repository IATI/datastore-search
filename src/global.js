import { reactive, readonly } from "vue";

const state = reactive({
  filters: [{field: "field1", value: "value1"},
            {field: "field1", value: "value1"}
  ]
});

const increment = function () {
  state.count++;
}

export default { state: readonly(state), increment };