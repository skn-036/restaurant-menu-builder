<script setup lang="ts">
import { computed } from 'vue';
import { FormTitleError } from '@/components/ui/form';

type Props = {
    modelValue?: string | number | string[] | undefined;
    label?: string;
    labelClass?: string;
    error?: string | null;
    errorClass?: string;
    required?: boolean;
    rows?: number;
};

type Emit = {
    (
        e: 'update:model-value',
        value: string | number | string[] | undefined
    ): void;
};

const props = withDefaults(defineProps<Props>(), {
    required: false,
    label: '',
    labelClass: '',
    error: null,
    errorClass: '',
    rows: 6,
});

const emit = defineEmits<Emit>();

const val = computed({
    get: () => props.modelValue,
    set: val => {
        emit('update:model-value', val);
    },
});
</script>

<template>
    <FormTitleError
        :label="label"
        :label-class="labelClass"
        :error="error"
        :error-class="errorClass"
        :required="required"
    >
        <textarea
            v-model="val"
            class="w-full rounded-md bg-white outline-none shadow-input focus:shadow-input-focus p-3 text-app-black"
            :rows="rows"
        />
    </FormTitleError>
</template>
