/// <reference types="Cypress"/>

describe('The results view', () => {
    it('has a visible search bar', () => {
        const query = 'test';
        cy.visit(`/?q=${query}`);
        cy.get('[data-cy="search-input"]').should('be.visible');
    });
    it('has a visible button for showing the advanced search sidebar', () => {
        const query = 'test';
        cy.visit(`/?q=${query}`);
        cy.get('[data-cy="advanced-search-button"]').should('be.visible');
    });

    describe('search bar', () => {
        it('remains on the results view after search', () => {
            const query = 'covid';
            const query2 = 'test';
            cy.visit(`/?q=${query}`);
            cy.fixture('simple_q_test').then((simple_q_test) => {
                cy.intercept(
                    `https://dev-api.iatistandard.org/dss/activity/search?wt=json&fl=id%2Ctitle_narrative%2Ctitle_narrative_xml_lang%2Cdescription_narrative%2Cdescription_narrative_xml_lang%2Ciati_identifier%2Clast_updated_datetime%2Creporting_org_narrative%2Cactivity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative&q=${query2}&sort=score+desc`,
                    simple_q_test
                );
                cy.intercept(
                    `https://api.iatistandard.org/dss/activity/search?wt=json&fl=id%2Ctitle_narrative%2Ctitle_narrative_xml_lang%2Cdescription_narrative%2Cdescription_narrative_xml_lang%2Ciati_identifier%2Clast_updated_datetime%2Creporting_org_narrative%2Cactivity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative&q=${query2}&sort=score+desc`,
                    simple_q_test
                );
            });
            cy.get('[data-cy="search-input"]').clear();
            cy.get('[data-cy="search-input"]').type(query2);
            cy.get('[data-cy="search-button"]').click();
            cy.url().should('includes', `/?q=${query2}`);
        });
    });
});
