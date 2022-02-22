<template>
  <div class="flex flex-col h-full min-w-fit sm:min-w-0">
    <div class="md:grid md:grid-cols-10 lg:grid-cols-11 md:gap-4 text-left">
      <div class="col-span-1 hidden xl:block"></div>
      <div class="m-auto col-span-4 xl:col-span-9 pl-2 lg:pl-0">
        <h1 class="text-2xl mt-5">About IATI Datastore Search</h1>
        <p class="mt-5">The <a class="hover:underline text-iati-grey" href="https://iatistandard.org">International Aid Transparency Initiative (IATI)</a> is a global campaign to create transparency in the records of how aid money is spent. It provides an open XML standard to which aid organisations can publish details of their activities. The IATI Datastore contains all IATI data known to the <a class="hover:underline text-iati-grey" href="https://www.iatiregistry.org/">IATI Registry</a> which is both <a class="hover:underline text-iati-grey" href="https://iatistandard.org/en/iati-standard/">version 2.0</a> or above, and <a class="hover:underline text-iati-grey" href="https://iativalidator.iatistandard.org/about">is valid</a> to at least a non-critical level.</p>
        <p class="mt-5 ml-10 font-semibold"><router-link to="/" class="hover:underline text-iati-grey">Datastore Search</router-link> allows anyone to search the IATI Datastore and then to download the data in either IATI XML, in JSON, or in CSV format.</p>
        <p class="mt-5 ml-10 font-semibold"><router-link to="/simple" class="hover:underline text-iati-grey">Simple Search</router-link> behaves just like any familiar search engine and allows users the ability to quickly search the natural language elements of IATI for any words or phrases of interest.</p>
        <p class="mt-5 ml-10 font-semibold"><router-link to="/advanced" class="hover:underline text-iati-grey">Advanced Search</router-link> allows users to filter their search results by any IATI element, and to chain those filters. Those filters can then be saved to file and loaded again at a later time.</p>
        <p class="mt-5">The IATI Datastore indexes and represents IATI data precisely as it is was originally published, with no transformations or layers of inferred meaning or metadata. <router-link to="/simple" class="hover:underline text-iati-grey">Simple Search</router-link> offers an introduction to that data and is intended to be as intuitive as possible, welcoming those with no prior knowledge of the IATI Standard. <router-link to="/advanced" class="hover:underline text-iati-grey">Advanced Search</router-link> allows a much deeper exploration, with every IATI element available to be added to a chain of filters. And for those who would like exceptional control of their queries, the <a class="hover:underline text-iati-grey" href="https://developer.iatistandard.org/api-details#api=datastore">Datastore API</a> is available, and hugely powerful.</p>
        
      </div>
    </div>
    <Results />
  </div>
</template>

<script>

export default {
  name: 'About',
}
</script>