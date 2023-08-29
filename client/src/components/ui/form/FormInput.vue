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
};

type Emit = {
    (e: 'update:model-value', value: string | number | null): void;
};

const props = withDefaults(defineProps<Props>(), {
    required: false,
    label: '',
    labelClass: '',
    error: null,
    errorClass: '',
    type: 'string',
});

const emit = defineEmits<Emit>();

const val = computed({
    get: () => props.modelValue,
    set: val => {
        emit('update:model-value', val);
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
        />
    </FormTitleError>
</template>
