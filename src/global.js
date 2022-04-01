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

const overrideFieldList = {
  budget:
    "dataset_version,dataset_generated_datetime,dataset_linked_data_default,last_updated_datetime,xml_lang,default_currency,humanitarian,hierarchy,linked_data_uri,budget_not_provided,iati_identifier,reporting_org_ref,reporting_org_type,reporting_org_secondary_reporter,reporting_org_narrative,reporting_org_narrative_xml_lang,title_narrative,title_narrative_xml_lang,description_type,description_narrative,description_narrative_xml_lang,participating_org_ref,participating_org_type,participating_org_role,participating_org_activity_id,participating_org_crs_channel_code,participating_org_narrative,participating_org_narrative_xml_lang,other_identifier_ref,other_identifier_type,other_identifier_owner_org_ref,other_identifier_owner_org_narrative,other_identifier_owner_org_narrative_xml_lang,activity_status_code,activity_date_type,activity_date_iso_date,activity_date_narrative,activity_date_narrative_xml_lang,contact_info_type,contact_info_organisation_narrative,contact_info_organisation_narrative_xml_lang,contact_info_department_narrative,contact_info_department_narrative_xml_lang,contact_info_person_name_narrative,contact_info_person_name_narrative_xml_lang,contact_info_job_title_narrative,contact_info_job_title_narrative_xml_lang,contact_info_telephone,contact_info_email,contact_info_website,contact_info_mailing_address_narrative,contact_info_mailing_address_narrative_xml_lang,activity_scope_code,recipient_country_code,recipient_country_percentage,recipient_country_narrative,recipient_country_narrative_xml_lang,recipient_region_code,recipient_region_vocabulary,recipient_region_vocabulary_uri,recipient_region_percentage,recipient_region_narrative,recipient_region_narrative_xml_lang,location_ref,location_location_reach_code,location_location_id_code,location_location_id_vocabulary,location_name_narrative,location_name_narrative_xml_lang,location_description_narrative,location_description_narrative_xml_lang,location_activity_description_narrative,location_activity_description_narrative_xml_lang,location_administrative_code,location_administrative_vocabulary,location_administrative_level,location_point_srsName,location_point_pos,location_exactness_code,location_location_class_code,location_feature_designation_code,sector_vocabulary,sector_vocabulary_uri,sector_code,sector_percentage,sector_narrative,sector_narrative_xml_lang,tag_code,tag_vocabulary,tag_vocabulary_uri,tag_narrative,tag_narrative_xml_lang,country_budget_items_vocabulary,country_budget_items_budget_item_code,country_budget_items_budget_item_percentage,country_budget_items_budget_item_description_narrative,country_budget_items_budget_item_description_narrative_xml_lang,humanitarian_scope_type,humanitarian_scope_vocabulary,humanitarian_scope_vocabulary_uri,humanitarian_scope_code,humanitarian_scope_narrative,humanitarian_scope_narrative_xml_lang,policy_marker_vocabulary,policy_marker_vocabulary_uri,policy_marker_code,policy_marker_significance,policy_marker_narrative,policy_marker_narrative_xml_lang,collaboration_type_code,default_flow_type_code,default_finance_type_code,default_aid_type_code,default_aid_type_vocabulary,default_tied_status_code,budget_type,budget_status,budget_period_start_iso_date,budget_period_end_iso_date,budget_value,budget_value_currency,budget_value_value_date,planned_disbursement_type,planned_disbursement_period_start_iso_date,planned_disbursement_period_end_iso_date,planned_disbursement_value,planned_disbursement_value_currency,planned_disbursement_value_value_date,planned_disbursement_provider_org_ref,planned_disbursement_provider_org_provider_activity_id,planned_disbursement_provider_org_type,planned_disbursement_provider_org_narrative,planned_disbursement_provider_org_narrative_xml_lang,planned_disbursement_receiver_org_ref,planned_disbursement_receiver_org_receiver_activity_id,planned_disbursement_receiver_org_type,planned_disbursement_receiver_org_narrative,planned_disbursement_receiver_org_narrative_xml_lang,capital_spend_percentage,document_link_url,document_link_format,document_link_title_narrative,document_link_title_narrative_xml_lang,document_link_description_narrative,document_link_description_narrative_xml_lang,document_link_category_code,document_link_language_code,document_link_document_date_iso_date,related_activity_ref,related_activity_type,legacy_data_name,legacy_data_value,legacy_data_iati_equivalent,conditions_attached,conditions_condition_type,conditions_condition_narrative,conditions_condition_narrative_xml_lang,result_type,result_aggregation_status,result_title_narrative,result_title_narrative_xml_lang,result_description_narrative,result_description_narrative_xml_lang,result_document_link_url,result_document_link_format,result_document_link_title_narrative,result_document_link_title_narrative_xml_lang,result_document_link_description_narrative,result_document_link_description_narrative_xml_lang,result_document_link_category_code,result_document_link_language_code,result_document_link_document_date_iso_date,result_reference_code,result_reference_vocabulary,result_reference_vocabulary_uri,result_indicator_measure,result_indicator_ascending,result_indicator_aggregation_status,result_indicator_title_narrative,result_indicator_title_narrative_xml_lang,result_indicator_description_narrative,result_indicator_description_narrative_xml_lang,result_indicator_document_link_url,result_indicator_document_link_format,result_indicator_document_link_title_narrative,result_indicator_document_link_title_narrative_xml_lang,result_indicator_document_link_description_narrative,result_indicator_document_link_description_narrative_xml_lang,result_indicator_document_link_category_code,result_indicator_document_link_language_code,result_indicator_document_link_document_date_iso_date,result_indicator_reference_vocabulary,result_indicator_reference_code,result_indicator_reference_indicator_uri,result_indicator_baseline_iso_date,result_indicator_baseline_year,result_indicator_baseline_value,result_indicator_baseline_location_ref,result_indicator_baseline_dimension_name,result_indicator_baseline_dimension_value,result_indicator_baseline_document_link_url,result_indicator_baseline_document_link_format,result_indicator_baseline_document_link_title_narrative,result_indicator_baseline_document_link_title_narrative_xml_lang,result_indicator_baseline_document_link_description_narrative,result_indicator_baseline_document_link_description_narrative_xml_lang,result_indicator_baseline_document_link_category_code,result_indicator_baseline_document_link_language_code,result_indicator_baseline_document_link_document_date_iso_date,result_indicator_baseline_comment_narrative,result_indicator_baseline_comment_narrative_xml_lang,result_indicator_period_period_start_iso_date,result_indicator_period_period_end_iso_date,result_indicator_period_target_value,result_indicator_period_target_location_ref,result_indicator_period_target_dimension_name,result_indicator_period_target_dimension_value,result_indicator_period_target_comment_narrative,result_indicator_period_target_comment_narrative_xml_lang,result_indicator_period_target_document_link_url,result_indicator_period_target_document_link_format,result_indicator_period_target_document_link_title_narrative,result_indicator_period_target_document_link_title_narrative_xml_lang,result_indicator_period_target_document_link_description_narrative,result_indicator_period_target_document_link_description_narrative_xml_lang,result_indicator_period_target_document_link_category_code,result_indicator_period_target_document_link_language_code,result_indicator_period_target_document_link_document_date_iso_date,result_indicator_period_actual_value,result_indicator_period_actual_location_ref,result_indicator_period_actual_dimension_name,result_indicator_period_actual_dimension_value,result_indicator_period_actual_comment_narrative,result_indicator_period_actual_comment_narrative_xml_lang,result_indicator_period_actual_document_link_url,result_indicator_period_actual_document_link_format,result_indicator_period_actual_document_link_title_narrative,result_indicator_period_actual_document_link_title_narrative_xml_lang,result_indicator_period_actual_document_link_description_narrative,result_indicator_period_actual_document_link_description_narrative_xml_lang,result_indicator_period_actual_document_link_category_code,result_indicator_period_actual_document_link_language_code,result_indicator_period_actual_document_link_document_date_iso_date,crs_add_other_flags_code,crs_add_other_flags_significance,crs_add_loan_terms_rate_1,crs_add_loan_terms_rate_2,crs_add_loan_terms_repayment_type_code,crs_add_loan_terms_repayment_plan_code,crs_add_loan_terms_commitment_date_iso_date,crs_add_loan_terms_repayment_first_date_iso_date,crs_add_loan_terms_repayment_final_date_iso_date,crs_add_loan_status_year,crs_add_loan_status_currency,crs_add_loan_status_value_date,crs_add_loan_status_interest_received,crs_add_loan_status_principal_outstanding,crs_add_loan_status_principal_arrears,crs_add_loan_status_interest_arrears,crs_add_channel_code,fss_extraction_date,fss_priority,fss_phaseout_year,fss_forecast,fss_forecast_year,fss_forecast_currency,fss_forecast_value_date",
  transaction:
    "dataset_version,dataset_generated_datetime,dataset_linked_data_default,last_updated_datetime,xml_lang,default_currency,humanitarian,hierarchy,linked_data_uri,budget_not_provided,iati_identifier,reporting_org_ref,reporting_org_type,reporting_org_secondary_reporter,reporting_org_narrative,reporting_org_narrative_xml_lang,title_narrative,title_narrative_xml_lang,description_type,description_narrative,description_narrative_xml_lang,participating_org_ref,participating_org_type,participating_org_role,participating_org_activity_id,participating_org_crs_channel_code,participating_org_narrative,participating_org_narrative_xml_lang,other_identifier_ref,other_identifier_type,other_identifier_owner_org_ref,other_identifier_owner_org_narrative,other_identifier_owner_org_narrative_xml_lang,activity_status_code,activity_date_type,activity_date_iso_date,activity_date_narrative,activity_date_narrative_xml_lang,contact_info_type,contact_info_organisation_narrative,contact_info_organisation_narrative_xml_lang,contact_info_department_narrative,contact_info_department_narrative_xml_lang,contact_info_person_name_narrative,contact_info_person_name_narrative_xml_lang,contact_info_job_title_narrative,contact_info_job_title_narrative_xml_lang,contact_info_telephone,contact_info_email,contact_info_website,contact_info_mailing_address_narrative,contact_info_mailing_address_narrative_xml_lang,activity_scope_code,recipient_country_code,recipient_country_percentage,recipient_country_narrative,recipient_country_narrative_xml_lang,recipient_region_code,recipient_region_vocabulary,recipient_region_vocabulary_uri,recipient_region_percentage,recipient_region_narrative,recipient_region_narrative_xml_lang,location_ref,location_location_reach_code,location_location_id_code,location_location_id_vocabulary,location_name_narrative,location_name_narrative_xml_lang,location_description_narrative,location_description_narrative_xml_lang,location_activity_description_narrative,location_activity_description_narrative_xml_lang,location_administrative_code,location_administrative_vocabulary,location_administrative_level,location_point_srsName,location_point_pos,location_exactness_code,location_location_class_code,location_feature_designation_code,sector_vocabulary,sector_vocabulary_uri,sector_code,sector_percentage,sector_narrative,sector_narrative_xml_lang,tag_code,tag_vocabulary,tag_vocabulary_uri,tag_narrative,tag_narrative_xml_lang,country_budget_items_vocabulary,country_budget_items_budget_item_code,country_budget_items_budget_item_percentage,country_budget_items_budget_item_description_narrative,country_budget_items_budget_item_description_narrative_xml_lang,humanitarian_scope_type,humanitarian_scope_vocabulary,humanitarian_scope_vocabulary_uri,humanitarian_scope_code,humanitarian_scope_narrative,humanitarian_scope_narrative_xml_lang,policy_marker_vocabulary,policy_marker_vocabulary_uri,policy_marker_code,policy_marker_significance,policy_marker_narrative,policy_marker_narrative_xml_lang,collaboration_type_code,default_flow_type_code,default_finance_type_code,default_aid_type_code,default_aid_type_vocabulary,default_tied_status_code,budget_type,budget_status,budget_period_start_iso_date,budget_period_end_iso_date,budget_value,budget_value_currency,budget_value_value_date,planned_disbursement_type,planned_disbursement_period_start_iso_date,planned_disbursement_period_end_iso_date,planned_disbursement_value,planned_disbursement_value_currency,planned_disbursement_value_value_date,planned_disbursement_provider_org_ref,planned_disbursement_provider_org_provider_activity_id,planned_disbursement_provider_org_type,planned_disbursement_provider_org_narrative,planned_disbursement_provider_org_narrative_xml_lang,planned_disbursement_receiver_org_ref,planned_disbursement_receiver_org_receiver_activity_id,planned_disbursement_receiver_org_type,planned_disbursement_receiver_org_narrative,planned_disbursement_receiver_org_narrative_xml_lang,capital_spend_percentage,document_link_url,document_link_format,document_link_title_narrative,document_link_title_narrative_xml_lang,document_link_description_narrative,document_link_description_narrative_xml_lang,document_link_category_code,document_link_language_code,document_link_document_date_iso_date,related_activity_ref,related_activity_type,legacy_data_name,legacy_data_value,legacy_data_iati_equivalent,conditions_attached,conditions_condition_type,conditions_condition_narrative,conditions_condition_narrative_xml_lang,result_type,result_aggregation_status,result_title_narrative,result_title_narrative_xml_lang,result_description_narrative,result_description_narrative_xml_lang,result_document_link_url,result_document_link_format,result_document_link_title_narrative,result_document_link_title_narrative_xml_lang,result_document_link_description_narrative,result_document_link_description_narrative_xml_lang,result_document_link_category_code,result_document_link_language_code,result_document_link_document_date_iso_date,result_reference_code,result_reference_vocabulary,result_reference_vocabulary_uri,result_indicator_measure,result_indicator_ascending,result_indicator_aggregation_status,result_indicator_title_narrative,result_indicator_title_narrative_xml_lang,result_indicator_description_narrative,result_indicator_description_narrative_xml_lang,result_indicator_document_link_url,result_indicator_document_link_format,result_indicator_document_link_title_narrative,result_indicator_document_link_title_narrative_xml_lang,result_indicator_document_link_description_narrative,result_indicator_document_link_description_narrative_xml_lang,result_indicator_document_link_category_code,result_indicator_document_link_language_code,result_indicator_document_link_document_date_iso_date,result_indicator_reference_vocabulary,result_indicator_reference_code,result_indicator_reference_indicator_uri,result_indicator_baseline_iso_date,result_indicator_baseline_year,result_indicator_baseline_value,result_indicator_baseline_location_ref,result_indicator_baseline_dimension_name,result_indicator_baseline_dimension_value,result_indicator_baseline_document_link_url,result_indicator_baseline_document_link_format,result_indicator_baseline_document_link_title_narrative,result_indicator_baseline_document_link_title_narrative_xml_lang,result_indicator_baseline_document_link_description_narrative,result_indicator_baseline_document_link_description_narrative_xml_lang,result_indicator_baseline_document_link_category_code,result_indicator_baseline_document_link_language_code,result_indicator_baseline_document_link_document_date_iso_date,result_indicator_baseline_comment_narrative,result_indicator_baseline_comment_narrative_xml_lang,result_indicator_period_period_start_iso_date,result_indicator_period_period_end_iso_date,result_indicator_period_target_value,result_indicator_period_target_location_ref,result_indicator_period_target_dimension_name,result_indicator_period_target_dimension_value,result_indicator_period_target_comment_narrative,result_indicator_period_target_comment_narrative_xml_lang,result_indicator_period_target_document_link_url,result_indicator_period_target_document_link_format,result_indicator_period_target_document_link_title_narrative,result_indicator_period_target_document_link_title_narrative_xml_lang,result_indicator_period_target_document_link_description_narrative,result_indicator_period_target_document_link_description_narrative_xml_lang,result_indicator_period_target_document_link_category_code,result_indicator_period_target_document_link_language_code,result_indicator_period_target_document_link_document_date_iso_date,result_indicator_period_actual_value,result_indicator_period_actual_location_ref,result_indicator_period_actual_dimension_name,result_indicator_period_actual_dimension_value,result_indicator_period_actual_comment_narrative,result_indicator_period_actual_comment_narrative_xml_lang,result_indicator_period_actual_document_link_url,result_indicator_period_actual_document_link_format,result_indicator_period_actual_document_link_title_narrative,result_indicator_period_actual_document_link_title_narrative_xml_lang,result_indicator_period_actual_document_link_description_narrative,result_indicator_period_actual_document_link_description_narrative_xml_lang,result_indicator_period_actual_document_link_category_code,result_indicator_period_actual_document_link_language_code,result_indicator_period_actual_document_link_document_date_iso_date,crs_add_other_flags_code,crs_add_other_flags_significance,crs_add_loan_terms_rate_1,crs_add_loan_terms_rate_2,crs_add_loan_terms_repayment_type_code,crs_add_loan_terms_repayment_plan_code,crs_add_loan_terms_commitment_date_iso_date,crs_add_loan_terms_repayment_first_date_iso_date,crs_add_loan_terms_repayment_final_date_iso_date,crs_add_loan_status_year,crs_add_loan_status_currency,crs_add_loan_status_value_date,crs_add_loan_status_interest_received,crs_add_loan_status_principal_outstanding,crs_add_loan_status_principal_arrears,crs_add_loan_status_interest_arrears,crs_add_channel_code,fss_extraction_date,fss_priority,fss_phaseout_year,fss_forecast,fss_forecast_year,fss_forecast_currency,fss_forecast_value_date",
};

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
    formats: ["XML", "JSON", "CSV"],
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
});

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
    }
  }

  state.fieldOptions = filterOptions;
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

  state.simpleSearchTerm = searchterm;
  let url = new URL(baseUrlSimple);
  url.searchParams.set("q", searchterm);
  url.searchParams.set("start", start);
  url.searchParams.set("rows", rows);
  url.searchParams.set(
    "sort",
    `${state.searchOrderField} ${state.searchOrderDirection}`
  );
  let result = await axios.get(url, axiosConfig);
  state.simpleSearch = true;
  state.query = searchterm;
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

  if (core in Object.keys(overrideFieldList)) {
    const fields = overrideFieldList[core];
    query = query + `&fl=${fields}`;
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
        filter["type"] === "boolean" ? filter["value"] : `"${filter["value"]}"`;
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
};
