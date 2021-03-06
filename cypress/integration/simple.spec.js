/// <reference types="Cypress"/>

describe("The simple view", () => {
  it("has a visible search bar", () => {
    cy.visit("/simple");
    cy.get("input[title=Search]").should("be.visible");
  });

  describe("search bar", () => {
    it("remains on the simple view after search", () => {
      cy.fixture("simple_q_test").then((simple_q_test) => {
        cy.intercept(
          "https://dev-api.iatistandard.org/dss/activity/search?wt=json&fl=id%2Ctitle_narrative%2Ctitle_narrative_xml_lang%2Cdescription_narrative%2Cdescription_narrative_xml_lang%2Ciati_identifier%2Clast_updated_datetime%2Creporting_org_narrative%2Cactivity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative&q=test&sort=score+desc",
          simple_q_test
        );
        cy.intercept(
          "https://api.iatistandard.org/dss/activity/search?wt=json&fl=id%2Ctitle_narrative%2Ctitle_narrative_xml_lang%2Cdescription_narrative%2Cdescription_narrative_xml_lang%2Ciati_identifier%2Clast_updated_datetime%2Creporting_org_narrative%2Cactivity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative&q=test&sort=score+desc",
          simple_q_test
        );
      });
      cy.get("input[title=Search]").clear();
      cy.get("input[title=Search]").type("test");
      cy.get("button[aria-label=Submit]").click();
      cy.url().should("includes", "/simple");
    });
  });
});
