<script setup lang="ts">
type Props = {
    label?: string;
    icon?: string;
    disabled?: boolean;
    onDisabledButtonClick?: () => void;
};

type Emit = {
    (e: 'click', event: MouseEvent): void;
};

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
});

const emit = defineEmits<Emit>();

const onButtonClick = (event: MouseEvent) => {
    if (!props.disabled) emit('click', event);
    else {
        if (typeof props.onDisabledButtonClick === 'function')
            props.onDisabledButtonClick();
    }
};
</script>

<template>
    <button
        type="button"
        class="bg-gradient hover:bg-gradient-hover shadow-gradient inline-flex px-3 py-2 gap-4 justify-center items-center rounded-md text-app-white"
        :class="[disabled ? 'opacity-50 !cursor-not-allowed' : '']"
        @click="onButtonClick"
    >
        <slot>
            <slot name="icon">
                <Icon
                    v-if="icon"
                    :type="icon"
                    class="w-[18px] h-4"
                    stroke="#f4f4f4"
                    stroke-width="3px"
                />
            </slot>

            <slot name="label">
                <span v-if="label" class="font-semibold my-auto">{{
                    label
                }}</span>
            </slot>
        </slot>
    </button>
</template>
