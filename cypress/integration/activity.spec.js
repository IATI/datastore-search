/// <reference types="Cypress"/>

describe("The single activity view", () => {
  it("Normal activity page renders with expected data", () => {
    cy.fixture("activity_test").then((activity_test) => {
      cy.intercept(
        "https://dev-api.iatistandard.org/dss/activity/select?wt=json&sort=iati_identifier%20asc&fl=title_narrative,description_narrative,participating_org_narrative,iati_identifier,last_updated_datetime,reporting_org_ref,reporting_org_narrative,activity_date*&rows=1&q=iati_identifier:%22XM-IATI-1%22",
        activity_test
      );
      cy.intercept(
        "https://api.iatistandard.org/dss/activity/select?wt=json&sort=iati_identifier%20asc&fl=title_narrative,description_narrative,participating_org_narrative,iati_identifier,last_updated_datetime,reporting_org_ref,reporting_org_narrative,activity_date*&rows=1&q=iati_identifier:%22XM-IATI-1%22",
        activity_test
      );
    });
    cy.visit("/activity/XM-IATI-1");
    cy.contains("XM-IATI-1");
    cy.contains("IATI Test Activity");
    cy.contains("This is an example description");
    cy.contains("IATI Test Org, UK");
    cy.contains("IATI Test Participating Org, UK");
  });

  it("Activity page with blank fields renders with expected data", () => {
    cy.fixture("activity_blank_fields_test").then(
      (activity_blank_fields_test) => {
        cy.intercept(
          "https://dev-api.iatistandard.org/dss/activity/select?wt=json&sort=iati_identifier%20asc&fl=title_narrative,description_narrative,participating_org_narrative,iati_identifier,last_updated_datetime,reporting_org_ref,reporting_org_narrative,activity_date*&rows=1&q=iati_identifier:%22XM-IATI-2%22",
          activity_blank_fields_test
        );
        cy.intercept(
          "https://api.iatistandard.org/dss/activity/select?wt=json&sort=iati_identifier%20asc&fl=title_narrative,description_narrative,participating_org_narrative,iati_identifier,last_updated_datetime,reporting_org_ref,reporting_org_narrative,activity_date*&rows=1&q=iati_identifier:%22XM-IATI-2%22",
          activity_blank_fields_test
        );
      }
    );
    cy.visit("/activity/XM-IATI-2");
    cy.contains("Title not provided");
    cy.contains("Description not provided");
    cy.contains("Name not provided");
    cy.contains("Participating organisations: Not provided");
  });
});
