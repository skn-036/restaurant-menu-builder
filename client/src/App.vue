<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, provide } from 'vue';
import Header from '@/components/layout/Header.vue';

import { appConfigProviderKey } from '@/symbols/app';

const windowWidth = ref(1440);
const setWindowWidth = () => {
    windowWidth.value = document.body.clientWidth;
};
onMounted(() => {
    setWindowWidth();
    window.addEventListener('resize', setWindowWidth, false);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', setWindowWidth, false);
});

provide(appConfigProviderKey, { windowWidth });
</script>

<template>
    <div class="w-full h-full">
        <Header />
        <main
            class="w-full max-w-app mx-auto px-1 md:px-4 lg:px-8 xl:px-16 pb-4"
        >
            <RouterView v-slot="{ Component }">
                <Transition>
                    <component :is="Component" />
                </Transition>
            </RouterView>
        </main>
    </div>
</template>
