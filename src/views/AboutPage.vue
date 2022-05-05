<template>
  <div class="flex flex-col h-full min-w-fit sm:min-w-0">
    <div class="text-left">
      <div class="mx-8 md:mx-auto md:max-w-[700px]">
        <h1 class="text-2xl border-b pb-2 mt-10">
          About IATI Datastore Search
        </h1>
        <p class="mt-5">
          The
          <a
            class="hover:underline text-iati-grey"
            href="https://iatistandard.org"
            >International Aid Transparency Initiative (IATI)</a
          >
          is a global initiative to improve the transparency of development and
          humanitarian resources and their results for addressing poverty and
          crises. It provides an open XML standard to which all organisations
          that distribute or spend resources in international development can
          publish details of their activities. The IATI Datastore contains all
          IATI data known to the
          <a
            class="hover:underline text-iati-grey"
            href="https://www.iatiregistry.org/"
            >IATI Registry</a
          >
          which is both version 2.0 or above and conforms to the IATI XML
          Schema. Files that do not conform to the IATI XML schema are marked as
          critically invalid in the
          <a
            class="hover:underline text-iati-grey"
            href="https://iativalidator.iatistandard.org/"
            >IATI Validator</a
          >.
          <router-link to="/" class="hover:underline text-iati-grey"
            >Datastore Search</router-link
          >
          allows anyone to search the IATI Datastore and then to download the
          data in either IATI XML, in JSON, or in CSV format.
        </p>
        <p class="mt-5 ml-10">
          <router-link
            to="/"
            class="hover:underline text-iati-grey font-semibold"
            >Simple Search</router-link
          >
          behaves just like any familiar search engine and allows users the
          ability to quickly search the natural language elements of IATI for
          any words or phrases of interest.
        </p>
        <p class="mt-5 ml-10">
          <router-link
            to="/advanced"
            class="hover:underline text-iati-grey font-semibold"
            >Advanced Search</router-link
          >
          allows users to filter their search results by any IATI element and
          chain those filters into complex queries which can be saved to file.
        </p>
        <p class="mt-5">
          To search for a particular phrase, use quotation marks. For example,
          <i>"rabbit production"</i> will return search results about rabbit
          production, where as <i>rabbit production</i> will return results
          about rabbits, and results about production.
        </p>
        <p class="mt-5 border-b pb-4">
          The IATI Datastore indexes and represents IATI data precisely as it is
          was originally published, with no transformations or layers of
          inferred meaning or metadata.
          <router-link to="/" class="hover:underline text-iati-grey"
            >Simple Search</router-link
          >
          offers an introduction to that data and is intended to be as intuitive
          as possible, welcoming those with no prior knowledge of the IATI
          Standard.
          <router-link to="/advanced" class="hover:underline text-iati-grey"
            >Advanced Search</router-link
          >
          allows a much deeper exploration, with every IATI element available to
          be added to a chain of filters. For those who would like exceptional
          control of their queries the
          <a
            class="hover:underline text-iati-grey"
            href="https://developer.iatistandard.org/api-details#api=datastore"
            >Datastore API</a
          >
          is available, and hugely powerful.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { pageview } from "vue-gtag";

export default {
  name: "AboutPage",
  mounted() {
    pageview({
      page_path: this.$route.fullPath,
      page_title: this.$route.name,
    });
  },
};
</script>
