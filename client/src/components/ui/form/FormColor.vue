<script setup lang="ts">
import { computed, ref } from 'vue';
import { FormTitleError } from '@/components/ui/form';
import Popper from 'vue3-popper';
import {
    Photoshop,
    Chrome,
    Material,
    Compact,
    Swatches,
    Slider,
    Sketch,
} from '@ckpack/vue-color';

type Props = {
    modelValue: string;
    label?: string;
    labelClass?: string;
    error?: string | null;
    errorClass?: string;
    required?: boolean;
    triggerClass?: string;
    allowInput?: boolean;
    colorComponent?:
        | 'Photoshop'
        | 'Chrome'
        | 'Material'
        | 'Compact'
        | 'Swatches'
        | 'Slider'
        | 'Sketch';
};

type Emit = {
    (e: 'update:model-value', value: string | null): void;
    (e: 'open'): void;
    (e: 'close'): void;
};

const props = withDefaults(defineProps<Props>(), {
    required: false,
    label: '',
    labelClass: '',
    error: null,
    errorClass: '',
    triggerClass: '',
    allowInput: false,
});

const emit = defineEmits<Emit>();

const val = computed({
    get: () => props.modelValue,
    set: val => {
        emit('update:model-value', val);
    },
});

const palleteOpened = ref(false);
const onPopperOpen = () => {
    palleteOpened.value = true;
    emit('open');
};

const onPopperClose = () => {
    palleteOpened.value = false;
    emit('close');
};

const onBlur = (event: FocusEvent) => {
    if (!event.target) return;
    const inputEl = event.target as HTMLInputElement;
    val.value = inputEl.value;
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
        <Popper
            placement="bottom-start"
            offset-distance="6"
            @open:popper="onPopperOpen"
            @close:popper="onPopperClose"
        >
            <slot>
                <div
                    class="rounded-md h-9 min-h-[36px] bg-white px-3 flex-start outline-none shadow-input text-app-black cursor-pointer"
                    :class="[
                        palleteOpened ? 'shadow-input-focus' : '',
                        triggerClass ? triggerClass : '',
                    ]"
                >
                    <div
                        v-if="val"
                        class="w-5 h-5 min-w-[20px] min-h-[20px] rounded-sm mr-2"
                        :style="{ background: val }"
                    ></div>

                    <input
                        v-if="allowInput"
                        :value="val"
                        class="all unset bg-transparent outline-none"
                        @blur="onBlur"
                    />
                    <div v-else>{{ val }}</div>
                </div>
            </slot>

            <template #content>
                <div
                    :class="
                        colorComponent &&
                        ['PhotoShop', 'Chrome', 'Sketch'].includes(
                            colorComponent
                        )
                            ? ''
                            : 'bg-white rounded-md p-4 border border-gray-300 shadow-input'
                    "
                >
                    <Photoshop
                        v-if="colorComponent === 'Photoshop'"
                        :model-value="val"
                        @update:model-value="value => (val = value.hex)"
                    />
                    <Chrome
                        v-else-if="colorComponent === 'Chrome'"
                        v-model="val"
                    />
                    <Material
                        v-else-if="colorComponent === 'Material'"
                        v-model="val"
                    />
                    <Compact
                        v-else-if="colorComponent === 'Compact'"
                        v-model="val"
                    />
                    <Swatches
                        v-else-if="colorComponent === 'Swatches'"
                        v-model="val"
                    />
                    <Slider
                        v-else-if="colorComponent === 'Slider'"
                        v-model="val"
                    />
                    <Sketch
                        v-else-if="colorComponent === 'Sketch'"
                        :model-value="val"
                        @update:model-value="value => (val = value.hex)"
                    />
                    <Sketch v-else v-model="val" />
                </div>
            </template>
        </Popper>
    </FormTitleError>
</template>

<style scoped>
:deep(.inline-block) {
    display: block !important;
}
</style>
