<script setup lang="ts">
import { computed } from 'vue';

import BaseStyle from './BaseStyle.vue';
import { FormColor } from '@/components/ui/form';

// types
type Props = {
    propName: string;
    propValue: string;
};

type Emit = {
    (e: 'update', propName: string, propValue: string | number): void;
};

// props
const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const color = computed({
    get: () => props.propValue,
    set: val => {
        emit('update', props.propName, val);
    },
});
</script>

<template>
    <BaseStyle :prop-name="propName" class="mb-3">
        <FormColor v-model="color" color-component="Sketch" />
    </BaseStyle>
</template>
