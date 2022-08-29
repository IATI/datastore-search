export default {
    message: {
        main_header: 'Main header',
        iati_standard_website: 'IATI Standard Website',
        datastore_search: 'Datastore Search',
        navigation: 'Navigation',
        simple_search: 'Simple Search',
        advanced_search: 'Advanced Search',
        api: 'API',
        about: 'About',
        search_iati_activities: 'Search IATI Activities...',
        switch_to_advanced_search: 'Switch to Advanced Search',
        datastore_search_is_part_of_the_iati_unified_platform:
            'Datastore Search is part of the IATI Unified Platform',
        privacy: 'Privacy',
        contact: 'Contact',
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
            would like exceptional control of their queries the
            <a
                class="hover:underline text-iati-grey"
                href="https://developer.iatistandard.org/api-details#api=datastore"
                >Datastore API</a
            >
            is available, and hugely powerful.
        `,
        overview_of_iati_activity: 'Overview of IATI Activity',
        back_to_results: 'Back to results',
        download: 'Download',
        activity_file: 'Activity File',
        results_file: 'Results File',
    },
};
