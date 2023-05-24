<script setup>
import { inject, ref } from 'vue';
import { ArrowDownTrayIcon, ArrowDownIcon, ChevronDownIcon } from '@heroicons/vue/20/solid';
import DropdownMenu from '../components/DropdownMenu.vue';
import DropdownMenuContent from './DropdownMenuContent.vue';
import DropdownMenuItem from './DropdownMenuItem.vue';

const props = defineProps({ iatiIdentifier: { type: String, default: null } });
const global = inject('global');
const core = ref('activity');
</script>

<template>
    <div>
        <DropdownMenu>
            <template #toggler>
                <button class="toggler text-grey-300 bg-iati-grey flex">
                    <ArrowDownTrayIcon class="inline h-4 w-5 text-white" />
                    <span class="align-bottom ml-2 text-white">Download</span>
                    <ChevronDownIcon class="inline h-5 w-5 text-white ml-4" />
                </button>
            </template>
            <DropdownMenuContent>
                <DropdownMenuItem
                    v-for="format in global.state.download.formats"
                    :key="format"
                    @click="global.toggleDownloadModal(format)"
                    >Download as {{ format }}</DropdownMenuItem
                >
            </DropdownMenuContent>
        </DropdownMenu>
        <teleport to="#modals">
            <div
                v-if="global.state.download.showModal"
                role="dialog"
                class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
            >
                <div class="max-w-sm p-6 bg-white divide-y divide-gray-500 rounded">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl">
                            {{
                                props.iatiIdentifier
                                    ? $t('message.download_activity_file')
                                    : $t('message.download_results_file')
                            }}
                        </h2>
                    </div>
                    <div class="mt-1">
                        <p
                            v-if="
                                global.state.download.selectedFormat != 'XML' &&
                                global.state.download.selectedFormat != 'EXCEL'
                            "
                            class="mb-4 mt-2 text-md"
                        >
                            {{ $t('message.download_confirmation_1') }}
                            <span v-if="props.iatiIdentifier">
                                {{ $t('message.download_confirmation_2a') }}
                            </span>
                            <span v-if="!props.iatiIdentifier">
                                {{
                                    $t('message.download_confirmation_2b', {
                                        count: global.state.responseTotal,
                                    })
                                }}
                            </span>
                            {{ $t('message.download_confirmation_3') }}
                            <select
                                v-model="core"
                                class="h-8 bg-white border rounded focus:outline-none focus:shadow-outline"
                            >
                                <option value="activity" :selected="true">
                                    {{ $t('message.download_confirmation_4a') }}
                                </option>
                                <option value="transaction">
                                    {{ $t('message.download_confirmation_4b') }}
                                </option>
                                <option value="budget">
                                    {{ $t('message.download_confirmation_4c') }}
                                </option>
                            </select>
                            {{
                                $t('message.download_confirmation_5a', {
                                    format: global.state.download.selectedFormat,
                                })
                            }}
                        </p>

                        <p
                            v-if="global.state.download.selectedFormat === 'EXCEL'"
                            class="mb-4 mt-2 text-md"
                        >
                            {{ $t('message.download_confirmation_1') }}
                            <span v-if="props.iatiIdentifier">
                                {{ $t('message.download_confirmation_2a') }}
                            </span>
                            <span v-if="!props.iatiIdentifier">
                                {{
                                    $t('message.download_confirmation_2b', {
                                        count: global.state.responseTotal,
                                    })
                                }}
                            </span>
                            {{ $t('message.download_confirmation_3') }}
                            <select
                                v-model="core"
                                class="h-8 bg-white border rounded focus:outline-none focus:shadow-outline"
                            >
                                <option value="activity" :selected="true">
                                    {{ $t('message.download_confirmation_4a') }}
                                </option>
                                <option value="transaction">
                                    {{ $t('message.download_confirmation_4b') }}
                                </option>
                                <option value="budget">
                                    {{ $t('message.download_confirmation_4c') }}
                                </option>
                            </select>
                            <span v-html="$t('message.download_confirmation_5b')"></span>
                        </p>

                        <p
                            v-if="global.state.download.selectedFormat === 'XML'"
                            class="mb-4 mt-2 text-md"
                        >
                            {{ $t('message.download_confirmation_1') }}

                            <span v-if="props.iatiIdentifier">
                                {{ $t('message.download_confirmation_2a') }}
                            </span>
                            <span v-if="!props.iatiIdentifier">
                                {{
                                    $t('message.download_confirmation_2b', {
                                        count: global.state.responseTotal,
                                    })
                                }}
                            </span>
                            {{ $t('message.download_confirmation_5c') }}
                        </p>

                        <div class="flex justify-between">
                            <button
                                class="px-4 py-2 text-white bg-iati-grey hover:bg-iati-blue rounded"
                                @click="global.cancelDownloadFile()"
                            >
                                {{ $t('message.cancel') }}
                            </button>
                            <button
                                class="px-4 py-2 text-white bg-iati-grey hover:bg-iati-blue rounded flex justify-between"
                                @click="
                                    global.downloadFile(
                                        global.state.download.selectedFormat,
                                        props.iatiIdentifier,
                                        core
                                    )
                                "
                            >
                                <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1" />
                                <span v-if="!global.state.download.fileLoading">{{
                                    $t('message.download')
                                }}</span>
                                <div
                                    v-if="global.state.download.fileLoading"
                                    style="border-top-color: transparent"
                                    class="w-6 h-6 p-2 border-4 border-white border-dotted rounded-full animate-spin"
                                ></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>
