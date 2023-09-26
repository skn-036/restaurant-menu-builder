<script setup lang="ts">
import { computed } from 'vue';

import FormTitleError from '@/components/ui/form/FormTitleError.vue';

// @ts-ignore
import VSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import useVueContext from '@/composables/vue/useVueContext';

type ToggleLoading = (loading: boolean) => null;
type Option = string | number | object;
type ModelValue = object | object[] | string | number | null;
type Props = {
    selectLabel?: string;
    labelClass?: string;
    error?: string | null;
    errorClass?: string;
    modelValue: ModelValue;
    selectClass?: string;
    required?: boolean;
    clearable?: boolean;
    options: Option[];
    label?: string;
    searchable?: boolean;
};
type Emit = {
    (e: 'update:model-value', data: ModelValue): void;
    (e: 'open'): void;
    (e: 'close'): void;
    (e: 'option:selecting', option: Option): void;
    (e: 'option:selected', option: Option): void;
    (e: 'option:deselecting', option: Option): void;
    (e: 'option:deselected', option: Option): void;
    (e: 'option:created', option: Option): void;
    (e: 'search', search: string, toggleLoading: ToggleLoading): void;
    (e: 'search:focus'): void;
    (e: 'search:blur'): void;
};

const props = withDefaults(defineProps<Props>(), {
    selectLabel: '',
    labelClass: '',
    error: null,
    errorClass: '',
    selectClass: '',
    required: false,
    clearable: false,
    label: 'label',
    searchable: true,
});

const emit = defineEmits<Emit>();

const selected = computed({
    get: () => props.modelValue,
    set: value => emit('update:model-value', value),
});

const vueSelectSlots = computed(() => [
    'footer',
    'list-footer',
    'header',
    'list-header',
    'no-options',
    // 'open-indicator',
    'option',
    'selected-option',
    'selected-option-container',
    'search',
    'spinner',
]);

const { slotNames, attributes } = useVueContext();
</script>

<template>
    <FormTitleError
        :label="selectLabel"
        :label-class="labelClass"
        :error="error"
        :error-class="errorClass"
        :required="required"
    >
        <VSelect
            v-model="selected"
            v-bind="attributes"
            class="skn-select"
            :class="[selectClass]"
            :label="label"
            :options="options"
            :clearable="clearable"
            @open="$emit('open')"
            @close="$emit('close')"
            @option:selecting="(option: Option) => $emit('option:selecting', option)"
            @option:selected="(option: Option) => $emit('option:selected', option)"
            @option:deselecting="(option: Option) => $emit('option:deselecting', option)"
            @option:deselected="(option: Option) => $emit('option:deselected', option)"
            @option:created="(option: Option) => $emit('option:created', option)"
            @search="
                (search: string, toggleLoading: ToggleLoading) =>
                    $emit('search', search, toggleLoading)
            "
            @search:focus="$emit('search:focus')"
            @search:blur="$emit('search:blur')"
        >
            <template
                v-for="slot in vueSelectSlots"
                :key="slot"
                #[slot]="slotProps"
            >
                <slot
                    v-if="slotNames.includes(slot)"
                    :name="slot"
                    v-bind="slotProps || {}"
                ></slot>
            </template>

            <template #open-indicator>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="14"
                    viewBox="0 0 8 14"
                    fill="none"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.00009 5.51057e-09C4.10335 -1.25111e-05 4.2055 0.0212975 4.30014 0.0625954C4.39478 0.103893 4.47988 0.164289 4.55009 0.24L7.80009 3.74C7.86707 3.81223 7.91916 3.89694 7.9534 3.9893C7.98763 4.08166 8.00334 4.17985 7.99963 4.27828C7.99591 4.37671 7.97285 4.47345 7.93175 4.56297C7.89065 4.65248 7.83232 4.73303 7.76009 4.8C7.68787 4.86697 7.60316 4.91907 7.5108 4.9533C7.41844 4.98754 7.32024 5.00325 7.22181 4.99953C7.12338 4.99582 7.02665 4.97275 6.93713 4.93165C6.84761 4.89056 6.76707 4.83223 6.70009 4.76L4.00009 1.852L1.30009 4.76C1.16483 4.90587 0.977167 4.99203 0.778378 4.99953C0.57959 5.00703 0.385963 4.93526 0.240094 4.8C0.094225 4.66474 0.00806256 4.47707 0.00056111 4.27828C-0.00694035 4.0795 0.0648337 3.88587 0.200094 3.74L3.45009 0.24C3.52031 0.164289 3.6054 0.103893 3.70005 0.0625954C3.79469 0.0212975 3.89684 -1.25111e-05 4.00009 5.51057e-09ZM0.240094 9.2C0.312317 9.13302 0.397027 9.08092 0.489387 9.04668C0.581747 9.01244 0.679947 8.99673 0.77838 9.00044C0.876812 9.00415 0.973549 9.02722 1.06307 9.06833C1.15258 9.10943 1.23313 9.16776 1.30009 9.24L4.00009 12.148L6.70009 9.24C6.83535 9.09413 7.02302 9.00797 7.22181 9.00047C7.4206 8.99296 7.61423 9.06474 7.76009 9.2C7.90596 9.33526 7.99213 9.52293 7.99963 9.72172C8.00713 9.9205 7.93536 10.1141 7.80009 10.26L4.55009 13.76C4.47989 13.8357 4.3948 13.8961 4.30016 13.9375C4.20551 13.9788 4.10336 14.0001 4.00009 14.0001C3.89683 14.0001 3.79467 13.9788 3.70003 13.9375C3.60539 13.8961 3.5203 13.8357 3.45009 13.76L0.200094 10.26C0.133112 10.1878 0.0810128 10.1031 0.0467719 10.0107C0.012531 9.91835 -0.00318098 9.82015 0.000533453 9.72171C0.00424789 9.62328 0.0273161 9.52655 0.0684203 9.43703C0.109524 9.34751 0.167859 9.26697 0.240094 9.2Z"
                        fill="#AFAFAF"
                    />
                </svg>
            </template>
        </VSelect>
    </FormTitleError>
</template>

<style scoped>
:deep(.skn-select .vs__dropdown-toggle) {
    height: 36px;
    background: #fff;
}

:deep(.skn-select .vs__dropdown-menu .vs__dropdown-option) {
    padding-top: 6px;
    padding-bottom: 6px;
}

:deep(.skn-select .vs__dropdown-menu .vs__dropdown-option:hover) {
    background: var(--gradient) !important;
    color: #fff !important;
}

:deep(
        .skn-select
            .vs__dropdown-menu
            .vs__dropdown-option.vs__dropdown-option--selected
    ) {
    display: flex;
}

:deep(
        .skn-select
            .vs__dropdown-menu
            .vs__dropdown-option.vs__dropdown-option--selected::after
    ) {
    content: '\2713';
    margin-left: auto;
    color: #000;
    font-weight: 700;
    font-size: 14px;
}

:deep(
        .skn-select
            .vs__dropdown-menu
            .vs__dropdown-option.vs__dropdown-option--selected:hover::after
    ) {
    color: #fff;
}

:deep(
        .skn-select
            .vs__dropdown-menu
            .vs__dropdown-option.vs__dropdown-option--highlight
    ) {
    background: transparent;
    color: #000;
}
</style>
