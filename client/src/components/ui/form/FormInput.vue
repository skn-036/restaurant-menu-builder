<script setup lang="ts">
import { computed } from 'vue';
import { FormTitleError } from '@/components/ui/form';

type Props = {
    modelValue: string | number | null;
    label?: string;
    labelClass?: string;
    error?: string | null;
    errorClass?: string;
    required: boolean;
    type: string;
    step?: string | number;
    mode: 'input' | 'blur';
};

type Emit = {
    (e: 'update:model-value', value: string | number | null): void;
    (e: 'focus', event: Event): void;
    (e: 'blur', value: string | number | null, event: Event): void;
};

const props = withDefaults(defineProps<Props>(), {
    required: false,
    label: '',
    labelClass: '',
    error: null,
    errorClass: '',
    type: 'string',
    mode: 'input',
});

const emit = defineEmits<Emit>();

const val = computed({
    get: () => props.modelValue,
    set: val => {
        if (props.mode === 'input') emit('update:model-value', val);
    },
});

const disableKeys = (event: KeyboardEvent, keys = ['e', 'E', '+', '-']) => {
    if (!keys?.length) return;
    keys.includes(event.key) && event.preventDefault();
};

const onKeyup = (event: KeyboardEvent) => {
    if (props.type !== 'number') return;
    disableKeys(event);
};

const onFocus = (event: Event) => {
    emit('focus', event);
};

const onBlur = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value ? target.value : null;

    if (props.mode === 'blur') emit('update:model-value', value);
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
        <input
            v-model="val"
            class="w-full rounded-md h-9 min-h-[36px] bg-white indent-3 pr-3 outline-none shadow-input focus:shadow-input-focus text-app-black"
            :type="type"
            :step="step"
            @keyup="onKeyup"
            @focus="onFocus"
            @blur="onBlur"
        />
    </FormTitleError>
</template>
