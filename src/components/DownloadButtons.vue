<template>
    <div id="result-download-buttons">    
        <button v-for="format in global.state.download.formats" :key="format" v-on:click="global.toggleDownloadModal(format)" class="float-left bg-iati-grey hover:bg-iati-grey text-white font-bold py-1 px-2 my-1 mx-2 rounded flex w-2/24">
            <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1"/>   
            <span>{{ format }}</span>
            <div>
                
            </div>
        </button>
    </div> 
    <teleport to="#modals" >
        <div role="dialog" v-if="global.state.download.showModal" class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div class="max-w-sm p-6 bg-white divide-y divide-gray-500 rounded">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl">Download {{ iati_identifier ? "Activity" : "Results" }} File</h2>
                </div>
                <div class="mt-1">
                    <p v-if="!iati_identifier && global.state.download.selectedFormat != 'XML'" class="mb-4 mt-2 text-md">Download {{ global.state.responseTotal }} results from the
                        <select v-model="core" class="h-8 bg-white border rounded focus:outline-none focus:shadow-outline">
                            <option value="activity" :selected="true">Activity</option>
                            <option value="transaction">Transaction</option>
                            <option value="budget">Budget</option>
                        </select>
                          core in {{ global.state.download.selectedFormat }} format?
                    </p>

                    <p v-if="!iati_identifier && global.state.download.selectedFormat === 'XML'" class="mb-4 mt-2 text-md">Download {{ global.state.responseTotal }}

                          activities in an IATI Activities XML document?
                    </p>

                    <p v-if="iati_identifier" class="mb-4 mt-2 text-md">Download Activity file in {{ global.state.download.selectedFormat }} format?</p>

                    <div class="flex justify-between">
                        <button class="px-4 py-2 text-white bg-iati-grey hover:bg-iati-blue rounded" v-on:click="global.toggleDownloadModal(null)">Cancel</button>
                        <button class="px-4 py-2 text-white bg-iati-grey hover:bg-iati-blue rounded flex justify-between" v-on:click="global.downloadFile(global.state.download.selectedFormat, iati_identifier, core)">
                            <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1"/>  
                            <span v-if="!global.state.download.fileLoading">Download</span>
                            <div v-if="global.state.download.fileLoading" style="border-top-color:transparent"
                                class="w-6 h-6 p-2 border-4 border-white border-dotted rounded-full animate-spin">
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>
import { ArrowDownIcon } from '@heroicons/vue/solid'

export default {
    name: 'DownloadButtons',
    inject: ["global"],
    props: ['iati_identifier'],
    components: {ArrowDownIcon},
    data() {
      return {core: 'activity'} 
    }
}
</script>

<style>
</style>