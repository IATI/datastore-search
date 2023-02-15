<script setup>
import { inject } from 'vue';
import FilterGroupActions from './FilterGroupActions.vue';

const props = defineProps({ filter: { type: Object, default: () => {} } });

const global = inject('global');

const onAddRule = () => {
    console.log('Adding Rule');
};
const onAddGroup = () => {
    console.log(global.state.fieldOptions);
    console.log('Adding Group');
};
</script>

<template>
    <div class="p-2 border">
        <FilterGroupActions @add-rule="onAddRule" @add-group="onAddGroup" />
        <div class="grid grid-cols-7 gap-4 my-3">
            <div class="col-span-3">
                <select
                    class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                >
                    <option ref="default-option" disabled value="" selected>
                        {{ $t('message.select_field') }}
                    </option>
                    <option
                        v-for="filterOption in global.state.fieldOptions"
                        :key="filterOption.field"
                        :selected="
                            global.isFieldOptionSelected(props.filter.id, filterOption.field)
                        "
                        :disabled="filterOption.disabled === true"
                    >
                        {{ filterOption.label }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>
