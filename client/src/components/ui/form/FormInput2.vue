<script setup lang="ts">
import { computed } from 'vue';

type Props = {
    modelValue: string | number | null;
    label?: string;
};

type Emit = {
    (e: 'update:model-value', value: string | number | null): void;
};

const props = withDefaults(defineProps<Props>(), {
    label: '',
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
    <div
        class="w-full rounded-md h-9 min-h-[36px] bg-white px-3 shadow-input focus-within:shadow-input-focus relative p-1"
    >
        <span
            v-if="label"
            class="text-sm text-app-black absolute -top-2.5 left-3 pr-3 z-10 bg-white"
            >{{ label }}</span
        >
        <input
            v-model="val"
            class="outline-none text-app-black w-full h-full"
        />
    </div>
</template>
