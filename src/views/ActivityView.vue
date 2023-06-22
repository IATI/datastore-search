<template>
    <div class="flex flex-col h-full">
        <ActivityResult />
    </div>
</template>

<script>
import ActivityResult from '../components/ActivityResult.vue';

export default {
    name: 'ActivityView',
    components: {
        ActivityResult,
    },
    inject: ['global'],
};
</script>
