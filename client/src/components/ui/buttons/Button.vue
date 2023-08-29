<script setup lang="ts">
interface Props {
    label: string;
    icon?: string;
}

withDefaults(defineProps<Props>(), {
    label: 'Button',
});
</script>

<template>
    <button
        type="button"
        class="bg-gradient hover:bg-gradient-hover shadow-gradient inline-flex px-3 py-2 gap-4 justify-center items-center rounded-md text-app-white"
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
                <span class="hidden sm:block font-semibold my-auto">{{
                    label
                }}</span>
            </slot>
        </slot>
    </button>
</template>
