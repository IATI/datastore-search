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

    describe('search bar, on search', () => {
        it('shows the results view with a URL query', () => {
            cy.visit('/');
            const query = 'test';
            cy.get('input[title=Search]').type(query);
            cy.get('button[aria-label=Submit]').click();
            cy.url().should('includes', `/?q=${query}`);
        });

        it('retains the search term', () => {
            cy.visit('/');
            cy.get('input[title=Search]').type('test');
            cy.get('button[aria-label=Submit]').click();
            cy.get('input[title=Search]').should('have.value', 'test');
        });
    });
});
