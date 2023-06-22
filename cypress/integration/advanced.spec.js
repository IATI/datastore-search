/// <reference types="Cypress"/>

describe('The advanced search', { testIsolation: false }, () => {
    beforeEach(() => {
        cy.intercept('https://dev-api.iatistandard.org/dss/resources/filters?locale=en').as(
            'getFilters'
        );
        cy.intercept('https://api.iatistandard.org/dss/resources/filters?locale=en').as(
            'getFilters'
        );
        cy.visit('/');
        cy.wait('@getFilters');
    });
    it('has a button to build query', () => {
        cy.contains('Build Query');
    });

    describe('side bar', () => {
        const query = 'test';
        beforeEach(() => {
            // cy.get('button[aria-label="Add an additional filter"]').click();
            cy.fixture('simple_q_test').then((simple_q_test) => {
                cy.intercept(
                    `https://dev-api.iatistandard.org/dss/activity/search?wt=json&fl=id%2Ctitle_narrative%2Ctitle_narrative_xml_lang%2Cdescription_narrative%2Cdescription_narrative_xml_lang%2Ciati_identifier%2Clast_updated_datetime%2Creporting_org_narrative%2Cactivity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative&q=${query}&sort=score+desc`,
                    simple_q_test
                );
                cy.intercept(
                    `https://api.iatistandard.org/dss/activity/search?wt=json&fl=id%2Ctitle_narrative%2Ctitle_narrative_xml_lang%2Cdescription_narrative%2Cdescription_narrative_xml_lang%2Ciati_identifier%2Clast_updated_datetime%2Creporting_org_narrative%2Cactivity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative&q=${query}&sort=score+desc`,
                    simple_q_test
                );
            });
        });
        it('can be toggled from the landing view', () => {
            cy.get('[data-cy="advanced-search-landing"]').should('be.visible');
            cy.get('[data-cy="search-bar--menu"]').should('not.be.visible');
            cy.get('[data-cy="advanced-search-landing"]').click();
            cy.get('[data-cy="search-bar--menu"]').should('be.visible');
            cy.get('[data-cy="close-advanced"]').click();
            cy.get('[data-cy="search-bar--menu"]').should('not.be.visible');
        });

        it('can be toggled from the results view', () => {
            cy.visit(`/?q=${query}`);

            cy.get('[data-cy="advanced-search-results"]').should('be.visible');
            cy.get('[data-cy="search-bar--menu"]').should('not.be.visible');
            cy.get('[data-cy="advanced-search-results"]').click();
            cy.get('[data-cy="search-bar--menu"]').should('be.visible');
            cy.get('[data-cy="close-advanced"]').click();
            cy.get('[data-cy="search-bar--menu"]').should('not.be.visible');
        });

        it('captures a representation of the basic search input', () => {
            const query = 'test';
            cy.visit(`/?q=${query}`);
            const validate = (value) => {
                cy.get('[data-cy="advanced-search-results"]').click();
                cy.get('[data-cy="field-selector"]').should('be.visible');
                cy.get('[data-cy="filter-text-input"]').should('have.value', value);
            };
            validate(query);

            // capture change
            const queryUpdate = 'test2';
            cy.get('[data-cy="close-advanced"]').click();
            cy.get('[data-cy="search-input"]').clear();
            cy.get('[data-cy="search-input"]').type(queryUpdate);
            cy.get('[data-cy="search-button"]').click();
            validate(queryUpdate);
        });

        describe('query', () => {
            beforeEach(() => {
                cy.visit('/');
                cy.get('[data-cy="advanced-search-landing"]').click();
                cy.get('[data-cy="build-query"]').click();
            });

            it('shows a dropdown when you click the Add Rule button', () => {
                cy.contains('Select field').should('not.exist');
                cy.get('[data-cy="add-rule"]').click();
                cy.contains('Select field');
            });

            it('can remove an existing rule', () => {
                cy.get('[data-cy="add-rule"]').click();
                cy.contains('Select field');
                cy.get('[data-cy="remove-rule"]').click();
                cy.contains('Select field').should('not.exist');
            });

            it('adds a group when you click the Add Group button', () => {
                cy.get('[data-cy="add-group"]').its('length').should('equal', 1);
                cy.get('[data-cy="add-group"]').click();
                cy.get('[data-cy="add-group"]').its('length').should('equal', 2);
            });

            it('can remove a nested group', () => {
                cy.get('[data-cy="add-group"]').click();
                cy.get('[data-cy="add-group"]').its('length').should('equal', 2);
                cy.get('[data-cy="remove-group"]').click();
                cy.get('[data-cy="add-group"]').its('length').should('equal', 1);
            });

            it('has a reset feature that requires confirmation', () => {
                cy.get('[data-cy="add-rule"]').click();
                cy.get('[data-cy="add-rule"]').click();
                cy.get('[data-cy="field-selector"]').its('length').should('equal', 2);

                cy.get('[data-cy="reset-filters"]').click();
                cy.get('[data-cy="field-selector"]').its('length').should('equal', 2); // confirm that a single click cannot reset
            });

            it('clears filters when a reset is confirmed', () => {
                cy.get('[data-cy="add-rule"]').click();
                cy.get('[data-cy="add-rule"]').click();
                cy.get('[data-cy="field-selector"]').its('length').should('equal', 2);

                cy.get('[data-cy="reset-filters"]').dblclick();
                cy.contains('Select field').should('not.exist');
                cy.contains('Build Query');
            });
        });
    });

    describe('filters', () => {
        // let baseUrl = 'https://dev-api.iatistandard.org/dss/activity/select?wt=json&fl=id,title_narrative,title_narrative_xml_lang,description_narrative,description_narrative_xml_lang,iati_identifier,last_updated_datetime,reporting_org_narrative,activity_date*&start=0&rows=10&hl=true&hl.method=unified&hl.fl=*_narrative&';
        const baseUrl =
            Cypress.config('baseUrl') === 'https://datastore.iatistandard.org'
                ? 'https://api.iatistandard.org/dss/activity/select'
                : 'https://dev-api.iatistandard.org/dss/activity/select';
        const urlSuffix = '&sort=score desc';
        const buildRouteMatcher = (query) => ({ url: `${baseUrl}*`, query });

        beforeEach(() => {
            cy.visit('/');
            window.localStorage.clear();
            cy.get('[data-cy="advanced-search-landing"]').click();
            cy.get('[data-cy="build-query"]').click();
        });

        it('can add, validate & run boolean rules', () => {
            cy.get('[data-cy="add-rule"]').click();
            cy.contains('Select field').click();
            cy.wait(1000);
            cy.contains('Humanitarian').click();
            cy.get('[data-cy="run-filters"]').click();
            cy.contains('Selection is required');
            cy.get('button:contains("TRUE")').click();
            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(buildRouteMatcher({ q: '(humanitarian:true)' }), advanced_q_test).as(
                    'booleanQuery'
                );
                cy.get('[data-cy="run-filters"]').click();
                cy.wait('@booleanQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can add, validate & run date rules', () => {
            const now = new Date(2022, 0, 1).getTime();
            cy.clock(now);
            cy.get('[data-cy="add-rule"]').click();
            cy.contains('Select field').click();
            cy.wait(1000);
            cy.contains('Activity Date Iso Date').click();

            cy.get('[data-cy="filter-date-input"]').click();
            cy.get('button:contains("31")').eq(1).click({ force: true });

            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    buildRouteMatcher({
                        q: '(activity_date_iso_date:"2022-01-31T00:00:00Z")',
                    }),
                    advanced_q_test
                ).as('dateQuery');

                cy.get('[data-cy="run-filters"]').click({ force: true });
                cy.wait('@dateQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can add, validate & run integer rules', () => {
            const now = new Date(2022, 0, 1).getTime();
            cy.clock(now);
            cy.get('[data-cy="add-rule"]').click();
            cy.contains('Select field').click();
            cy.wait(1000);
            cy.contains('Hierarchy').click();
            cy.get('[data-cy="run-filters"]').click({ force: true });
            cy.contains('Value is required');

            cy.get('[data-cy="filter-number-input"]').type(1);

            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(buildRouteMatcher({ q: '(hierarchy:"1")' }), advanced_q_test).as(
                    'integerQuery'
                );
                cy.get('[data-cy="run-filters"]').click({ force: true });
                cy.wait('@integerQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can add, validate & run number rules', () => {
            const now = new Date(2022, 0, 1).getTime();
            cy.clock(now);
            cy.get('[data-cy="add-rule"]').click();
            cy.contains('Select field').click();
            cy.wait(1000);
            cy.contains('Sector Percentage').click();
            cy.get('[data-cy="run-filters"]').click({ force: true });
            cy.contains('Value is required');

            cy.get('[data-cy="filter-number-input"]').type(99.9);

            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    buildRouteMatcher({ q: '(sector_percentage:"99.9")' }),
                    advanced_q_test
                ).as('numberQuery');
                cy.get('[data-cy="run-filters"]').click({ force: true });
                cy.wait('@numberQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can add, validate & run select rules', () => {
            const now = new Date(2022, 0, 1).getTime();
            cy.clock(now);
            cy.get('[data-cy="add-rule"]').click();
            cy.contains('Select field').click();
            cy.wait(1000);
            cy.contains('Budget Type').click();
            cy.get('[data-cy="run-filters"]').click({ force: true });
            cy.contains('Selection is required');

            cy.get('[data-cy="filter-select-input"] select').select('2 - Revised');

            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(buildRouteMatcher({ q: '(budget_type:2)' }), advanced_q_test).as(
                    'selectQuery'
                );
                cy.get('[data-cy="run-filters"]').click({ force: true });
                cy.wait('@selectQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can add, validate & run text rules', () => {
            const now = new Date(2022, 0, 1).getTime();
            cy.clock(now);
            cy.get('[data-cy="add-rule"]').click();
            cy.contains('Select field').click();
            cy.wait(1000);
            cy.contains('Title Narrative').click();
            cy.get('[data-cy="filter-text-input"]').type('Hello world');

            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    buildRouteMatcher({ q: '(title_narrative:(Hello world))' }),
                    advanced_q_test
                ).as('textQuery');
                cy.get('[data-cy="run-filters"]').click({ force: true });
                cy.wait('@textQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can create complex queries by grouping', () => {
            const now = new Date(2022, 0, 1).getTime();
            let addRuleCount = 0;
            let selectFieldCount = 0;
            cy.clock(now);
            cy.get('[data-cy="add-rule"]').click();
            addRuleCount++;
            cy.contains('Select field').click();
            selectFieldCount++;
            cy.wait(1000);
            cy.contains('Title Narrative').click();
            cy.get('[data-cy="filter-text-input"]').type('Hello world');

            // add new group
            cy.get('[data-cy="add-group"]').click();
            cy.get('[data-cy="group-or"').eq(1).click({ force: true });

            // add field to new group
            cy.get('[data-cy="add-rule"]').eq(addRuleCount).click({ force: true });
            cy.contains('Select field').click({ force: true });
            cy.get('[data-cy="field-selector"] input')
                .eq(selectFieldCount)
                .type('Humanitarian{enter}');
            selectFieldCount++;
            cy.get('button:contains("TRUE")').click({ force: true });

            // add field to new group
            cy.get('[data-cy="add-rule"]').eq(addRuleCount).click({ force: true });
            addRuleCount++;
            cy.contains('Select field').click({ force: true });
            cy.get('[data-cy="field-selector"] input')
                .eq(selectFieldCount)
                .type('Activity Date Iso Date{enter}');
            selectFieldCount++;
            cy.get('[data-cy="filter-date-input"]').click({ force: true });
            cy.get('button:contains("31")').eq(1).click({ force: true });

            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    buildRouteMatcher({
                        q: '(title_narrative:(Hello world) AND (humanitarian:true OR activity_date_iso_date:"2022-01-31T00:00:00Z"))',
                    }),
                    advanced_q_test
                ).as('groupQuery');
                cy.get('[data-cy="run-filters"]').click({ force: true });
                cy.wait('@groupQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can add, validate & run geospacial rules', () => {
            const now = new Date(2022, 0, 1).getTime();
            cy.clock(now);
            cy.get('[data-cy="add-rule"]').click();
            cy.contains('Select field').click();
            cy.wait(1000);
            cy.get('[data-cy="field-selector"] input').type('Geospatial search{enter}');
            cy.get('button:contains("Open map")').click();
            cy.wait(1000);
            cy.get('button:contains("Apply")').click();

            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(
                    buildRouteMatcher({ q: '(location_point_latlon:[-31.7,-45.0 TO 31.7,45.0])' }),
                    advanced_q_test
                ).as('spatialQuery');
                cy.get('[data-cy="run-filters"]').click({ force: true });
                cy.wait('@spatialQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        it('can add, validate & run combo rules', () => {
            const now = new Date(2022, 0, 1).getTime();
            cy.clock(now);
            cy.get('[data-cy="add-rule"]').click();
            cy.contains('Select field').click();
            cy.wait(1000);
            cy.get('[data-cy="field-selector"] input').type('Sector Code{enter}');
            cy.get('[data-cy="filter-combo-input"] input').type('11110');

            cy.fixture('advanced_q_test').then((advanced_q_test) => {
                cy.intercept(buildRouteMatcher({ q: '(sector_code:(11110))' }), advanced_q_test).as(
                    'comboQuery'
                );
                cy.get('[data-cy="run-filters"]').click({ force: true });
                cy.wait('@comboQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });
        });

        xit('can add/run all filter types and import/export the generated config', () => {
            // combo filters
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(13).select('Sector Code');
            cy.wait(1000);
            cy.get('input[type="text"]').eq(3).type('11111');
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
                        '+AND+sector_code%3A%2811111%29' +
                        urlSuffix,
                    advanced_q_test
                ).as('comboQuery');
                cy.get('button[aria-label="Run search query with selected filters"]').click();
                cy.wait('@comboQuery').then((interception) => {
                    cy.wrap(interception.response.statusCode).should('eq', 200);
                });
            });

            // export and import filters
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
                                '+AND+sector_code%3A%2811111%29' +
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

            // function normally after import
            cy.get('button[aria-label="Add an additional filter"]').click();
            cy.get('select').eq(14).select('Description Narrative');
            cy.wait(1000);
            cy.get('input[type="text"]').eq(4).type('Hello world2');
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
                        '+AND+sector_code%3A%2811111%29' +
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
