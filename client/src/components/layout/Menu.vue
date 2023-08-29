<script setup lang="ts">
import { NavMenu } from '@/types/layout/header';
interface Props {
    menu: NavMenu;
}
defineProps<Props>();
</script>

<template>
    <RouterLink :to="menu.route" #="{ isActive }">
        <div
            class="h-[74px] w-max flex-center"
            :class="[
                isActive
                    ? 'text-app-black border-b-4 border-theme active-menu'
                    : 'text-gray-color',
            ]"
        >
            {{ menu.title }}
        </div>
    </RouterLink>
</template>

<style scoped>
.active-menu {
    border-top: 4px solid #fff !important;
}
</style>
