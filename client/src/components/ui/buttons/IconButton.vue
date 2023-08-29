<script setup lang="ts">
interface Props {
    icon?: string;
}

defineProps<Props>();
</script>

<template>
    <button
        type="button"
        class="bg-gradient hover:bg-gradient-hover shadow-gradient flex-center w-[28px] h-[28px] min-w-[28px] min-h-[28px] rounded-md text-app-white"
    >
        <slot>
            <Icon
                v-if="icon"
                :type="icon"
                class="w-[18px] h-4"
                stroke="#f4f4f4"
                stroke-width="2px"
            />
        </slot>
    </button>
</template>
