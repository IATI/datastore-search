/// <reference types="Cypress"/>

describe('The landing page', () => {

  it('has a header', () => {
    cy.visit('/');
    cy.contains('Datastore Search');
  });

  it('has a footer', () => {
    cy.visit('/');
    cy.contains('Copyright');
  });

  describe('search bar', () => {
    it('successfully routes a search to the simple page', () => {
      cy.get('input[title=Search]').type('test');
      cy.get('button[aria-label=Submit]').click();
      cy.url().should('includes', '/simple');
    });
  });

});
  