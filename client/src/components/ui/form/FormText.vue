<script setup lang="ts">
import { computed } from 'vue';
import FormTitleError from '@/components/ui/form/FormTitleError.vue';

type Props = {
    modelValue?: string | number | string[] | undefined;
    label?: string;
    labelClass?: string;
    error?: string | null;
    errorClass?: string;
    required?: boolean;
    rows?: number;
    mode?: 'input' | 'blur';
};

type Emit = {
    (
        e: 'update:model-value',
        value: string | number | string[] | undefined
    ): void;
    (e: 'focus', event: Event): void;
    (
        e: 'blur',
        value: string | number | string[] | undefined,
        event: Event
    ): void;
};

const props = withDefaults(defineProps<Props>(), {
    required: false,
    label: '',
    labelClass: '',
    error: null,
    errorClass: '',
    rows: 6,
    mode: 'input',
});

const emit = defineEmits<Emit>();

const val = computed({
    get: () => props.modelValue,
    set: val => {
        if (props.mode === 'input') emit('update:model-value', val);
    },
});

const onFocus = (event: Event) => {
    emit('focus', event);
};

const onBlur = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value ? target.value : null;

    // @ts-ignore
    if (props.mode === 'blur') emit('update:model-value', value);
    // @ts-ignore
    emit('blur', value, event);
};
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
            @focus="onFocus"
            @blur="onBlur"
        />
    </FormTitleError>
</template>
