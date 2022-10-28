/// <reference types="Cypress"/>

describe('The advanced view', () => {
    it('has a button to add filters', () => {
        cy.intercept('https://dev-api.iatistandard.org/dss/resources/filters?locale=en').as(
            'getFilters'
        );
        cy.intercept('https://api.iatistandard.org/dss/resources/filters?locale=en').as(
            'getFilters'
        );
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
            cy.get('select').eq(1).select('Title Narrative');
            cy.get('input[placeholder="Search term"]').should('be.visible');
        });

        it('yields an error message when the search is run empty', () => {
            cy.get('button[aria-label="Run search query with selected filters"]').click();
            cy.contains('Search term is required');
        });

        it('clears the error message when another field is selected', () => {
            cy.get('select').eq(1).select('Dataset Version');
            cy.contains('Search term is required').should('not.exist');
        });
    });

    describe('filters', () => {
        let baseUrl =
            'https://dev-api.iatistandard.org/dss/activity/select?wt=json&fl=id%2Ctitle_narrative%2Ctitle_narrative_xml_lang%2Cdescription_narrative%2Cdescription_narrative_xml_lang%2Ciati_identifier%2Clast_updated_datetime%2Creporting_org_narrative%2Cactivity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative&';
        if (Cypress.config('baseUrl') === 'https://datastore.iatistandard.org') {
            baseUrl =
                'https://api.iatistandard.org/dss/activity/select?wt=json&fl=id%2Ctitle_narrative%2Ctitle_narrative_xml_lang%2Cdescription_narrative%2Cdescription_narrative_xml_lang%2Ciati_identifier%2Clast_updated_datetime%2Creporting_org_narrative%2Cactivity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative&';
        }

        const urlSuffix = '&sort=score+desc';

        it('can select boolean filters', () => {
            cy.get('button[aria-label="Remove filter"]').click();
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(1).select('Humanitarian');
            cy.get('button[aria-label="Run search query with selected filters"]').click();
            cy.contains('Selection is required');
            cy.get('button:contains("TRUE")').click();
            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(baseUrl + 'q=humanitarian%3Atrue' + urlSuffix, advanced_q_test).as(
                    'booleanQuery'
                );
                cy.get('button[aria-label="Run search query with selected filters"]').click();
                cy.wait('@booleanQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can select date filters', () => {
            const now = new Date(2022, 0, 1).getTime();
            cy.clock(now);
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(2).select('Activity Date Iso Date');
            cy.get('button:contains("<")').click();
            cy.get('input[type="text"]').click();
            cy.get('button:contains("31")').eq(1).click();
            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    baseUrl +
                        'q=humanitarian%3Atrue' +
                        '+AND+activity_date_iso_date%3A%5B+*+TO+2022-01-31T00%3A00%3A00Z%5D' +
                        urlSuffix,
                    advanced_q_test
                ).as('dateQuery');
                cy.get('button[aria-label="Run search query with selected filters"]').click();
                cy.wait('@dateQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can select integer filters', () => {
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(3).select('Hierarchy');
            cy.get('button[aria-label="Run search query with selected filters"]').click();
            cy.contains('Value is required');
            cy.get('input[type="number"]').type(1);
            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    baseUrl +
                        'q=humanitarian%3Atrue' +
                        '+AND+activity_date_iso_date%3A%5B+*+TO+2022-01-31T00%3A00%3A00Z%5D' +
                        '+AND+hierarchy%3A%221%22' +
                        urlSuffix,
                    advanced_q_test
                ).as('integerQuery');
                cy.get('button[aria-label="Run search query with selected filters"]').click();
                cy.wait('@integerQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can select number filters', () => {
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(4).select('Sector Percentage');
            cy.get('button[aria-label="Run search query with selected filters"]').click();
            cy.contains('Value is required');
            cy.get('input[min="0"]').type(99.9);
            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    baseUrl +
                        'q=humanitarian%3Atrue' +
                        '+AND+activity_date_iso_date%3A%5B+*+TO+2022-01-31T00%3A00%3A00Z%5D' +
                        '+AND+hierarchy%3A%221%22' +
                        '+AND+sector_percentage%3A%2299.9%22' +
                        urlSuffix,
                    advanced_q_test
                ).as('numberQuery');
                cy.get('button[aria-label="Run search query with selected filters"]').click();
                cy.wait('@numberQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can select select filters', () => {
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(5).select('Budget Type');
            cy.get('button[aria-label="Run search query with selected filters"]').click();
            cy.contains('Selection is required');
            cy.wait(1000);
            cy.get('select').eq(6).select('2 - Revised');
            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    baseUrl +
                        'q=humanitarian%3Atrue' +
                        '+AND+activity_date_iso_date%3A%5B+*+TO+2022-01-31T00%3A00%3A00Z%5D' +
                        '+AND+hierarchy%3A%221%22' +
                        '+AND+sector_percentage%3A%2299.9%22' +
                        '+AND+budget_type%3A2' +
                        urlSuffix,
                    advanced_q_test
                ).as('selectQuery');
                //
                cy.get('button[aria-label="Run search query with selected filters"]').click();
                cy.wait('@selectQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can select text filters', () => {
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(7).select('Title Narrative');
            cy.wait(1000);
            cy.get('input[type="text"]').eq(1).type('Hello world');
            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    baseUrl +
                        'q=humanitarian%3Atrue' +
                        '+AND+activity_date_iso_date%3A%5B+*+TO+2022-01-31T00%3A00%3A00Z%5D' +
                        '+AND+hierarchy%3A%221%22' +
                        '+AND+sector_percentage%3A%2299.9%22' +
                        '+AND+budget_type%3A2' +
                        '+AND+title_narrative%3A%28Hello+world%29' +
                        urlSuffix,
                    advanced_q_test
                ).as('textQuery');
                cy.get('button[aria-label="Run search query with selected filters"]').click();
                cy.wait('@textQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can select grouping filters', () => {
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(8).select('Boolean Grouping');
            cy.wait(1000);
            cy.get('button:contains("(")').eq(3).click();
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(9).select('Humanitarian');
            cy.wait(1000);
            cy.get('button:contains("TRUE")').eq(1).click();
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(10).select('Boolean Grouping');
            cy.wait(1000);
            cy.get('button:contains(")")').eq(4).click();
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(11).select('Humanitarian');
            cy.wait(1000);
            cy.get('button:contains("TRUE")').eq(2).click();
            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    baseUrl +
                        'q=humanitarian%3Atrue' +
                        '+AND+activity_date_iso_date%3A%5B+*+TO+2022-01-31T00%3A00%3A00Z%5D' +
                        '+AND+hierarchy%3A%221%22' +
                        '+AND+sector_percentage%3A%2299.9%22' +
                        '+AND+budget_type%3A2' +
                        '+AND+title_narrative%3A%28Hello+world%29' +
                        '+AND+%28humanitarian%3Atrue%29+AND+humanitarian%3Atrue' +
                        urlSuffix,
                    advanced_q_test
                ).as('textQuery');
                cy.get('button[aria-label="Run search query with selected filters"]').click();
                cy.wait('@textQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can use the spatial filter', () => {
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(12).select('Geospatial search');
            cy.wait(1000);
            cy.get('button:contains("Open map")').click();
            cy.wait(1000);
            cy.get('button:contains("Apply")').click();
            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    baseUrl +
                        'q=humanitarian%3Atrue' +
                        '+AND+activity_date_iso_date%3A%5B+*+TO+2022-01-31T00%3A00%3A00Z%5D' +
                        '+AND+hierarchy%3A%221%22' +
                        '+AND+sector_percentage%3A%2299.9%22' +
                        '+AND+budget_type%3A2' +
                        '+AND+title_narrative%3A%28Hello+world%29' +
                        '+AND+%28humanitarian%3Atrue%29+AND+humanitarian%3Atrue' +
                        '+AND+location_point_latlon%3A%5B*%5D' +
                        urlSuffix,
                    advanced_q_test
                ).as('spatialQuery');
                cy.get('button[aria-label="Run search query with selected filters"]').click();
                cy.wait('@spatialQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can export and import filters', () => {
            const downloadsFolder = Cypress.config('downloadsFolder');
            cy.get('button[aria-label="Export filters to file"]').click();
            cy.get('button.bg-iati-grey:contains("Export")').click();
            cy.get('button[aria-label="Import filters from file"]').click();

            cy.task('isExistFile', downloadsFolder).then((filename) => {
                cy.readFile(filename).then((fileContent) => {
                    cy.get('input[type="file"]').attachFile({
                        fileContent: fileContent,
                        fileName: filename,
                        mimeType: 'application/json',
                    });
                    cy.get('button.bg-iati-grey:contains("Import")').click();
                    cy.wait(1000);
                    cy.fixture('advanced_q_test').then((advanced_q_test) => {
                        cy.intercept(
                            baseUrl +
                                'q=humanitarian%3Atrue' +
                                '+AND+activity_date_iso_date%3A%5B+*+TO+2022-01-31T00%3A00%3A00Z%5D' +
                                '+AND+hierarchy%3A%221%22' +
                                '+AND+sector_percentage%3A%2299.9%22' +
                                '+AND+budget_type%3A2' +
                                '+AND+title_narrative%3A%28Hello+world%29' +
                                '+AND+%28humanitarian%3Atrue%29+AND+humanitarian%3Atrue' +
                                '+AND+location_point_latlon%3A%5B*%5D' +
                                urlSuffix,
                            advanced_q_test
                        ).as('eximQuery');
                        cy.get(
                            'button[aria-label="Run search query with selected filters"]'
                        ).click();
                        cy.wait('@eximQuery').then((interception) => {
                            cy.wrap(interception.response.statusCode).should('eq', 200);
                        });
                    });
                });
            });
        });

        it('can continue to function normally after import', () => {
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(13).select('Description Narrative');
            cy.wait(1000);
            cy.get('input[type="text"]').eq(3).type('Hello world2');
            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    baseUrl +
                        'q=humanitarian%3Atrue' +
                        '+AND+activity_date_iso_date%3A%5B+*+TO+2022-01-31T00%3A00%3A00Z%5D' +
                        '+AND+hierarchy%3A%221%22' +
                        '+AND+sector_percentage%3A%2299.9%22' +
                        '+AND+budget_type%3A2' +
                        '+AND+title_narrative%3A%28Hello+world%29' +
                        '+AND+%28humanitarian%3Atrue%29+AND+humanitarian%3Atrue' +
                        '+AND+location_point_latlon%3A%5B*%5D' +
                        '+AND+description_narrative%3A%28Hello+world2%29' +
                        urlSuffix,
                    advanced_q_test
                ).as('textQuery');
                cy.get('button[aria-label="Run search query with selected filters"]').click();
                cy.wait('@textQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });
    });
});
