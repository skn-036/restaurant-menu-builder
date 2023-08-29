<script setup lang="ts">
import { FormLabel } from '@/components/ui/form';

type Props = {
    label?: string;
    labelClass?: string;
    error?: string | null;
    errorClass?: string;
    required?: boolean;
};

withDefaults(defineProps<Props>(), {
    label: '',
    labelClass: '',
    error: null,
    errorClass: '',
    required: false,
});
</script>

<template>
    <div class="w-full">
        <FormLabel v-if="label" :class="[labelClass ? labelClass : '']">
            {{ label }}
            <span v-if="required" class="text-red-700 ml-1">*</span>
        </FormLabel>
        <slot></slot>
        <div
            v-if="error"
            class="w-full text-red-600 text-xs mt-1"
            :class="[errorClass ? errorClass : '']"
        >
            {{ error }}
        </div>
    </div>
</template>
