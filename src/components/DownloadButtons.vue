<template>
    <div id="result-download-buttons">    
        <button v-for="format in global.state.download.formats" :key="format" v-on:click="global.toggleModal(format)" class="float-left bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-1 rounded flex mr-5 w-2/24 pr-2">
            <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1"/>   
            <span>{{ format }}</span>
            <div>
                
            </div>
        </button>
    </div> 
    <teleport to="#modals" >
        <div v-if="global.state.download.showModal" class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div class="max-w-sm p-6 bg-white divide-y divide-gray-500 rounded">
                <div class="flex items-center justify-between">
                    <h3 class="text-2xl">Download Results File</h3>
                </div>
                <div class="mt-1">
                    <p class="mb-4 mt-2 text-md">Download {{ global.state.responseTotal }} results in {{ global.state.download.selectedFormat }} format?</p>
                    <div class="flex justify-between">
                        <button class="px-4 py-2 text-white bg-red-500 hover:bg-red-700 rounded" v-on:click="global.toggleModal(null)">Cancel</button>
                        <button class="px-4 py-2 text-white bg-iati-blue hover:bg-iati-grey rounded flex justify-between" v-on:click="global.downloadFile(global.state.download.selectedFormat, iati_identifier)">
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
    components: {ArrowDownIcon}
}
</script>

<style>
</style>