export default {
    message: {
        main_header: 'Main header',
        iati_standard_website: 'IATI Standard Website',
        datastore_search: 'Datastore Search',
        navigation: 'Navigation',
        simple_search: 'Search',
        advanced_search: 'Advanced Search',
        api: 'API',
        about: 'About',
        search: 'Search',
        search_iati_data: 'Search IATI data',
        search_iati_activities: 'Search IATI Activities...',
        submit: 'Submit',
        switch_to_advanced_search: 'Switch to Advanced Search',
        datastore_search_is_part_of_the_iati_unified_platform:
            'Datastore Search is part of the IATI Unified Platform',
        privacy: 'Privacy',
        contact: 'Contact',
        twitter_aria: 'iati twitter profile link',
        linkedin_aria: 'iati linkedin profile link',
        about_iati_datastore_search: 'About IATI Datastore Search',
        about_para_1: `
            The
            <a
                class="hover:underline text-iati-grey"
                href="https://iatistandard.org"
                >International Aid Transparency Initiative (IATI)</a
            >
            is a global initiative to improve the transparency of
            development and humanitarian resources and their results for
            addressing poverty and crises. It provides an open XML
            standard to which all organisations that distribute or spend
            resources in international development can publish details
            of their activities. The IATI Datastore contains all IATI
            data known to the
            <a
                class="hover:underline text-iati-grey"
                href="https://www.iatiregistry.org/"
                >IATI Registry</a
            >
            which is both version 2.0 or above and conforms to the IATI
            XML Schema. Files that do not conform to the IATI XML schema
            are marked as critically invalid in the
            <a
                class="hover:underline text-iati-grey"
                href="https://iativalidator.iatistandard.org/"
                >IATI Validator</a
            >.
            <a href="/" class="hover:underline text-iati-grey"
                >Datastore Search</a
            >
            allows anyone to search the IATI Datastore and then to
            download the data in either IATI XML, in JSON, or in CSV
            format.
        `,
        about_para_2: `
            <a
                href="/"
                class="hover:underline text-iati-grey font-semibold"
                >Simple Search</a
            >
            behaves just like any familiar search engine and allows
            users the ability to quickly search the natural language
            elements of IATI for any words or phrases of interest.
        `,
        about_para_3: `
            <a
                href="/advanced"
                class="hover:underline text-iati-grey font-semibold"
                >Advanced Search</a
            >
            allows users to filter their search results by any IATI
            element and chain those filters into complex queries which
            can be saved to file.
        `,
        about_para_4: `
            To search for a particular phrase, use quotation marks. For
            example,
            <i>"rabbit production"</i> will return search results about
            rabbit production, where as <i>rabbit production</i> will
            return results about rabbits, and results about production.
            For more information on how to use the Datastore Search, please
            see the <a href="https://docs.google.com/document/d/1WcfE4z4CbhQnsWFgMchU-LDSz8ZbT5a6HHbMCBaLrOo/edit?usp=sharing" class="hover:underline text-iati-grey font-semibold">User Guide</a>.
        `,
        about_para_5: `
            The IATI Datastore indexes and represents IATI data
            precisely as it is was originally published, with no
            transformations or layers of inferred meaning or metadata.
            <a href="/" class="hover:underline text-iati-grey"
                >Simple Search</a
            >
            offers an introduction to that data and is intended to be as
            intuitive as possible, welcoming those with no prior
            knowledge of the IATI Standard.
            <a
                href="/advanced"
                class="hover:underline text-iati-grey"
                >Advanced Search</a
            >
            allows a much deeper exploration, with every IATI element
            available to be added to a chain of filters. For those who
            would like exceptional control of their queries, the
            <a
                class="hover:underline text-iati-grey"
                href="https://developer.iatistandard.org/api-details#api=datastore"
                >Datastore API</a
            >
            is available and hugely powerful.
        `,
        overview_of_iati_activity: 'Overview of IATI Activity',
        back_to_results: 'Back to results',
        download: 'Download',
        download_activity_file: 'Download Activity File',
        download_results_file: 'Download Results File',
        download_confirmation_1: 'Download',
        download_confirmation_2a: 'this IATI Activity',
        download_confirmation_2b: '%{count} results',
        download_confirmation_3: 'from the',
        download_confirmation_4a: 'Activity',
        download_confirmation_4b: 'Transaction',
        download_confirmation_4c: 'Budget',
        download_confirmation_5a: 'core in %{format} format?',
        download_confirmation_5b: `
            core in Excel-optimised* CSV format?<br /><br /><span
                class="text-sm"
                >*This ensures Excel will open with correct
                encoding and formatting, but will truncate cells
                longer than 32,700 characters.</span
            >
        `,
        download_confirmation_5c: 'in an IATI Activities XML document?',
        cancel: 'Cancel',
        view: 'View',
        view_on: 'View on',
        publisher: 'Publisher',
        iati_identifier: 'IATI Identifier',
        last_updated: 'Last updated',
        participating_organisations: 'Participating organisations',
        planned_start: 'Planned Start',
        actual_start: 'Actual Start',
        planned_end: 'Planned End',
        actual_end: 'Actual End',
        not_present: 'Not Present',
        description_not_provided: 'Description not provided',
        title_not_provided: 'Title not provided',
        name_not_provided: 'Name not provided',
        not_provided: 'Not provided',
        advanced_unavailable_para1: `
            Sorry, the advanced filter page isn't available for devices with
            smaller screens.
        `,
        advanced_unavailable_para2: `
            Please
            <a href="/simple" class="text-underline text-blue"
                >try the Simple Search</a
            >
            instead, or switch to a device with a larger screen.
        `,
        run_aria: 'Run search query with selected filters',
        run: 'Run',
        reset: 'Reset',
        confirm_reset: 'Confirm reset',
        export_aria: 'Export filters to file',
        export: 'Export',
        import_aria: 'Import filters from file',
        import: 'Import',
        add_aria: 'Add an additional filter',
        add: 'Add',
        add_filter: 'Build Query',
        import_filters: 'Import Query',
        export_filters: 'Export Filters',
        export_para1: `Export currently selected filters to file?`,
        export_para2: `
            This will allow you to import them later to run the same
            query or share with someone else.
        `,
        import_para1: `Import filters from file?`,
        import_para2: `
            Select a .json file previously exported from the Datastore
            Advanced Search.
        `,
        file: 'File',
        and: 'AND',
        or: 'OR',
        select_field: 'Select field',
        true: 'TRUE',
        false: 'FALSE',
        select_from_codes: 'Select from %{name} codes',
        found_matching_iati_activities: 'Found <b>%{count}</b> matching IATI activities',
        sort: 'Sort',
        no_match: 'No matching IATI Activities - please try a different search',
        not_found: 'Not Found',
        not_found_para: `
            Oops, we couldn't find that page. Try going
            <a class="hover:underline" href="/">Home</a>
        `,
        advanced: 'Advanced',
        found_activities: 'Found <b>%{count}</b> activities',
        results_by_advanced_search:
            'Results filtered by advanced parameters. See <b>Advanced Search</b> tab for more details.',
        relevance: 'Relevance',
        sort_relevance_label: 'Sort results by relevance',
        identifier: 'Identifier',
        sort_identifier_label: 'Sort results by IATI identifier',
        all_narratives: 'All Narratives',
        all_narratives_desc: 'Searches all IATI narrative fields, used by simple search',
        boolean_grouping: 'Boolean Grouping',
        boolean_grouping_desc:
            'Parenthesis for grouping boolean queries. Ensure every opening parenthesis is matched with a closing parenthesis.',
        special_fields: 'Special fields',
        grouping: 'Grouping',
        standard_fields: 'Standard fields',
        incompatible_file_error: 'Incompatible file detected. Please try a different file.',
        incompatible_file_version:
            'Deprecated file version. The query can be run, but cannot be edited.',
        search_term_is_required: 'Search term is required',
        selection_is_required: 'Selection is required',
        value_is_required: 'Value is required',
        date_is_required: 'Date is required',
        is_not_allowed: '%{bad} is not allowed for Datastore Search queries',
        percentage_validation: 'Percentage must be between 0 and 100',
        integer_validation: 'Value must be a whole number',
        fetch_error:
            'There was an error fetching your query. Please check how your query is constructed and try again.',
        search_term: 'Search term',
        spatial_search: 'Geospatial search',
        location_point_latlon_desc: 'Spatial search on location/point/pos latitude and longitude',
        latlon_placeholder: 'X1,Y1 TO X2,Y2',
        use_map: 'Open map',
        pan_and_zoom: 'Pan and zoom map to select bounds',
        apply: 'Apply',
    },
};
