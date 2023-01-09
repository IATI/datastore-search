/// <reference types="Cypress"/>

describe('The landing view', () => {
    it('has a header', () => {
        cy.visit('/');
        cy.contains('Datastore Search');
    });

    it('has a visible search bar', () => {
        cy.visit('/');
        cy.get('input[title=Search]').should('be.visible');
    });

    it('has a footer', () => {
        cy.visit('/');
        cy.contains('IATI Unified Platform');
    });

    describe('search bar', () => {
        it('routes a search to the simple view', () => {
            cy.get('input[title=Search]').type('test');
            cy.get('button[aria-label=Submit]').click();
            cy.url().should('includes', '/simple');
        });

        it('retains the search term after routing', () => {
            cy.get('input[title=Search]').should('have.value', 'test');
        });
    });
});
