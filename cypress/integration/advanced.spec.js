/// <reference types="Cypress"/>

describe('The advanced view', () => {

  it('has a button to add filters', () => {
    cy.intercept('https://dev-api.iatistandard.org/dss/resources/filters').as('getFilters')
    cy.visit('/advanced');
    cy.wait('@getFilters');
    cy.contains('Add Filter');
  });

  describe('side bar', () => {

    it('creates a dropdown when you click Add Filters button', () => {
      cy.get('button[aria-label="Add an additional filter"]').click();
      cy.contains('Select field');
    });

    it('creates a textbox when you select Title Narrative', () => {
      cy.get('select').select('Title Narrative');
      cy
        .get('input[placeholder="Search term"]')
        .should('be.visible');
    });

    it('yields an error message when the search is run empty', () => {
      cy.get('button[aria-label="Run search query with selected filters"]').click();
      cy.contains('Search term is required');
    });

    it('clears the error message when another field is selected', () => {
      cy.get('select').select('Dataset Version');
      cy.contains('Search term is required').should('not.exist');
    });

  });

});
