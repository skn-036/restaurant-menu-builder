<script setup lang="ts">
import Logo from '@/components/layout/Logo.vue';
import Menu from '@/components/layout/Menu.vue';

import { NavMenu } from '@/types/layout/header';

const menus: NavMenu[] = [
    {
        title: 'Homepage',
        route: '/',
    },
    // {
    //     title: 'Homepage 2',
    //     route: '/home-2',
    // },
    // {
    //     title: 'Template builder',
    //     route: '/template-builder',
    // },
];
</script>

<template>
    <header
        class="w-full bg-white flex-center shadow-header sticky top-0 z-[999]"
    >
        <div
            class="w-full max-w-app flex-between h-[74px] px-0 md:px-4 lg:px-8 xl:px-16"
        >
            <div class="flex-start">
                <Logo />

                <div class="ml-8 flex-start gap-10 h-[74px]">
                    <Menu
                        v-for="menu in menus"
                        :key="menu.title"
                        :menu="menu"
                    />
                </div>
            </div>
        </div>
    </header>
</template>
