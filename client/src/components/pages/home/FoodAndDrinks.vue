<script setup lang="ts">
import { ref } from 'vue';
import { Title } from '@/components/ui/components';
import { AddProductToTemplate, ProductList } from '@/components/pages/home';

import { Product } from '@/types/home/home';

const updatingProduct = ref<Product | null>(null);
</script>

<template>
    <div class="w-full p-8 rounded-xl bg-white">
        <div class="w-full flex flex-col gap-8">
            <Title>Speisen und Getränke</Title>

            <AddProductToTemplate
                :updating-product="updatingProduct"
                @update:updating-product="updatingProduct = $event"
            />

            <ProductList @update:product="updatingProduct = $event" />
        </div>
    </div>
</template>
