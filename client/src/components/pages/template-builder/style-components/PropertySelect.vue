<script setup lang="ts">
import { computed } from 'vue';

import BaseStyle from './BaseStyle.vue';
import { FormSelect } from '@/components/ui/form';

// types
type Props = {
    propName: string;
    propValue: string;
    options: string[];
};

type Emit = {
    (e: 'update', propName: string, propValue: string): void;
};

// props
const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const propertyVal = computed({
    get: () => props.propValue,
    set: val => {
        emit('update', props.propName, val);
    },
});
</script>

<template>
    <BaseStyle :prop-name="propName" class="mb-3">
        <FormSelect
            v-model="propertyVal"
            :options="options"
            :clearable="false"
        />
    </BaseStyle>
</template>
