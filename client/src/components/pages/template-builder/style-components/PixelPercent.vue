<script setup lang="ts">
import { ref, watchEffect, watch, nextTick } from 'vue';

import BaseStyle from './BaseStyle.vue';
import { FormInput, FormSelect } from '@/components/ui/form';

// types
type Props = {
    propName: string;
    propValue: string | number;
    pixelOnly?: boolean;
};

type Emit = {
    (e: 'update', propName: string, propValue: string | number): void;
};

// props
const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const setValueType = () => {
    if (isNaN(parseInt(props.propValue.toString()))) return '';
    if (props.pixelOnly) return 'px';
    return props.propValue.toString().includes('%') ? '%' : 'px';
};
const setCssValue = () => {
    return props.propValue.toString().split('px').join('').split('%').join('');
};
const cssValue = ref<string>(setCssValue());
const valueType = ref<'px' | '%' | ''>(setValueType());

watchEffect(() => {
    cssValue.value = setCssValue();
    valueType.value = setValueType();
});

watch([() => cssValue.value, () => valueType.value], () => {
    let val = cssValue.value;
    if (!val) val = '0';

    val = isNaN(parseInt(val)) ? val : `${val}${valueType.value}`;

    emit('update', props.propName, val);
});
watch(
    () => valueType.value,
    (val, oldVal) => {
        if (val && !oldVal) cssValue.value = '100';
    }
);
watch(
    () => cssValue.value,
    async () => {
        if (props.propName !== 'fontSize') return;

        await nextTick();

        const intCssVal = parseInt(cssValue.value);
        if (isNaN(intCssVal)) return;

        const offset = intCssVal > 32 ? 12 : 6;
        const lineHeight = (intCssVal + offset).toString();
        emit('update', 'lineHeight', lineHeight);
    }
);
</script>

<template>
    <BaseStyle :prop-name="propName" class="mb-3">
        <FormInput v-model="cssValue" mode="blur" class="w-20" />
        <FormSelect
            v-model="valueType"
            :id="propName"
            :options="pixelOnly ? ['px'] : ['px', '%']"
            class="ml-1"
            :clearable="false"
        />
    </BaseStyle>
</template>
