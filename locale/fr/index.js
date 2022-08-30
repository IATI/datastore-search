export default {
    message: {
        main_header: 'En-tête principal',
        iati_standard_website: 'Site de la norme de l’IITA',
        datastore_search: 'Rechercher le Datastore',
        navigation: 'Menu',
        simple_search: 'Recherche simple',
        advanced_search: 'Recherche avancée',
        api: 'API',
        about: 'À propos',
        search: 'Rechercher',
        search_iati_data: 'Rechercher des données de l’IITA',
        search_iati_activities: 'Rechercher des activités de l’IITA...',
        submit: 'Envoyer',
        switch_to_advanced_search: 'Recherche avancée',
        datastore_search_is_part_of_the_iati_unified_platform:
            'Rechercher le Datastore fait partie de la plateforme unifiée de l’IITA',
        privacy: 'Politique de confidentialité',
        contact: 'Contact',
        twitter_aria: 'lien profil Twitter',
        linkedin_aria: 'lien profil LinkedIn',
        about_iati_datastore_search:
            'À propos Rechercher le Datastore de l’IITA',
        about_para_1: `
            La
            <a
                class="hover:underline text-iati-grey"
                href="https://iatistandard.org"
                >Initiative Internationale pour la Transparence de l'Aide (IITA)</a
            >
            est une initiative mondiale visant à améliorer la transparence des
            ressources humanitaires et de développement et leurs résultats pour
            lutte contre la pauvreté et les crises. Il fournit un XML ouvert
            norme à laquelle toutes les organisations qui distribuent ou dépensent
            ressources en développement international peuvent publier des détails
            de leurs activités. La banque de données IATI contient tous les IATI
            données connues de la
            <a
                class="hover:underline text-iati-grey"
                href="https://www.iatiregistry.org/"
                >le registre de l’IITA</a
            >
            qui est à la fois la version 2.0 ou supérieure et conforme à l'IATI
            Schéma XML. Fichiers non conformes au schéma XML de l'IATI
            sont marqués comme gravement invalides dans le
            <a
                class="hover:underline text-iati-grey"
                href="https://iativalidator.iatistandard.org/"
                >outil de validation de l’IITA</a
            >.
            <a href="/" class="hover:underline text-iati-grey"
                >Rechercher le Datastore</a
            >
            permet à quiconque de rechercher dans la banque de données IATI, puis de
            télécharger les données au format IATI XML, au format JSON ou au format CSV
            format.
        `,
        about_para_2: `
            <a
                href="/"
                class="hover:underline text-iati-grey font-semibold"
                >La recherche simple</a
            >
            se comporte comme n'importe quel moteur de recherche familier et permet
            utilisateurs la possibilité de rechercher rapidement le langage naturel
            éléments de l'IITA pour tous les mots ou phrases d'intérêt.
        `,
        about_para_3: `
            <a
                href="/advanced"
                class="hover:underline text-iati-grey font-semibold"
                >La recherche avancée</a
            >
            permet aux utilisateurs de filtrer leurs résultats de recherche par n'importe quel
            éléments de l'IITA et enchaîner ces filtres dans des requêtes complexes qui
            peut être enregistré dans un fichier.
        `,
        about_para_4: `
            Pour rechercher une expression particulière, utilisez des guillemets. Pour
            Exemple,
            <i>"production de lapins"</i> renverra des résultats de recherche sur
            la production de lapins, alors que la <i>production de lapins</i>
            renvoient des résultats sur les lapins et des résultats sur la production.
            Attention, vous devez utiliser des guillemets comme " " et non comme « ».
        `,
        about_para_5: `
            Le Datastore de l’IITA indexe et représente les données de l’IITA
            précisément tel qu'il a été publié à l'origine, sans
            transformations ou couches de signification ou de métadonnées inférées.
            <a href="/" class="hover:underline text-iati-grey"
                >La recherche simple</a
            >
            offre une introduction à ces données et est destinée à être aussi
            intuitif que possible, accueillant ceux qui n'ont pas d'antécédents
            connaissance de la norme de l’IITA.
            <a
                href="/advanced"
                class="hover:underline text-iati-grey"
                >La recherche avancée</a
            >
            permet une exploration beaucoup plus approfondie, avec chaque élément de l'IITA
            disponible pour être ajouté à une chaîne de filtres. Pour ceux qui
            souhaitent un contrôle exceptionnel de leurs requêtes
            <a
                class="hover:underline text-iati-grey"
                href="https://developer.iatistandard.org/api-details#api=datastore"
                >API de Datastore</a
            >
            est disponible et extrêmement puissante.
        `,
        overview_of_iati_activity: 'Aperçu de la activité de l’IITA',
        back_to_results: 'Retour aux résultats',
        download: 'Télécharger',
        download_activity_file: 'Télécharger le fichier d’activité',
        download_results_file: 'Télécharger le fichier de résultats',
        download_confirmation_1: 'Télécharger',
        download_confirmation_2a: 'cette activité de l’IITA',
        download_confirmation_2b: '%{count} résultats',
        download_confirmation_3: 'à partir de noyau',
        download_confirmation_4a: 'd’activité',
        download_confirmation_4b: 'de transaction',
        download_confirmation_4c: 'budgétaire',
        download_confirmation_5a: 'au format %{format} ?',
        download_confirmation_5b: `
            au format CSV optimisé pour Excel*?<br /><br /><span
                class="text-sm"
                >*Cela garantit qu'Excel s'ouvrira avec le bon
                    l'encodage et le formatage, mais tronquera les cellules
                    plus de 32 700 caractères.</span
            >
        `,
        download_confirmation_5c:
            'dans un document XML des activités de l’IITA?',
        cancel: 'Annuler',
        view: 'Visiter',
        publisher: 'Éditeur',
        iati_identifier: 'Identifiant de l’IITA',
        last_updated: 'Dernière mise à jour',
        participating_organisations: 'Organisations participantes',
        planned_start: 'Début prévu',
        actual_start: 'Début réel',
        planned_end: 'Fin prévue',
        actual_end: 'Fin réelle',
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
            <a href="/simple" class="hover:underline text-blue-600"
                >try the Simple Search</a
            >
            instead, or switch to a device with a larger screen.
        `,
        run_aria: 'Run search query with selected filters',
        run: 'Run',
        export_aria: 'Export filters to file',
        export: 'Export',
        import_aria: 'Import filters from file',
        import: 'Import',
        add_aria: 'Add an additional filter',
        add: 'Add',
        add_filter: 'Add Filter',
        import_filters: 'Import Filters',
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
        found_matching_iati_activities:
            'Found <b>%{count}</b> matching IATI activities',
        sort: 'Sort',
        no_match: 'No matching IATI Activities - please try a different search',
        not_found: 'Not Found',
        not_found_para: `
            Oops, we couldn't find that page. Try going
            <a class="hover:underline" href="/">Home</a>
        `,
        advanced: 'Advanced',
        found_activities: 'Found <b>%{count}</b> activities',
        relevance: 'Relevance',
        identifier: 'Identifier',
        all_narratives: 'All Narratives',
        all_narratives_desc:
            'Searches all IATI narrative fields, used by simple search',
        boolean_grouping: 'Boolean Grouping',
        boolean_grouping_desc:
            'Parenthesis for grouping boolean queries. Ensure every opening parenthesis is matched with a closing parenthesis.',
        special_fields: 'Special fields',
        grouping: 'Grouping',
        standard_fields: 'Standard fields',
        incompatible_file_error:
            'Incompatible file detected. Please try a different file.',
        search_term_is_required: 'Search term is required',
        selection_is_required: 'Selection is required',
        value_is_required: 'Value is required',
        date_is_required: 'Date is required',
        is_not_allowed: '%{bad} is not allowed for Datastore Search queries',
        percentage_validation: 'Percentage must be between 0 and 100',
        integer_validation: 'Value must be a whole number',
        fetch_error:
            'There was an error fetching your query. Please check how your query is constructed and try again.',
    },
};
