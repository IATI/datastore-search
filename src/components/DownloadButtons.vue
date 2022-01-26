<template>
    <div id="result-download-buttons" class="pt-5 flex mx-5">    
        <button  v-for="option in global.state.downloadOptions" :key="option.format" v-on:click="global.downloadFile(option.format)" class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-1 rounded flex ml-8 w-2/24 pr-2">
            <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1"/>
            <span v-if="!option.isLoading">{{ option.format }}</span>
            <div>
                <div v-if="option.isLoading" style="border-top-color:transparent"
                    class="w-6 h-6 p-2 border-4 border-white border-dotted rounded-full animate-spin">
                </div>
            </div>
        </button>
    </div> 
</template>

<script>
import { ArrowDownIcon } from '@heroicons/vue/solid'

export default {
    name: 'DownloadButtons',
    inject: ["global"],
    components: {ArrowDownIcon}
}
</script>

<style>

</style>