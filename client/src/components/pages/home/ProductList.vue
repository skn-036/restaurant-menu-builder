<script setup lang="ts">
import { inject } from 'vue';
import { ProductCard } from '@/components/pages/home';
import { Dnd } from '@/components/ui/drag';

import { Product } from '@/types/home/home';
import { templateInformationProviderKey } from '@/symbols/home/home';
import { TemplateInformationProvider } from '@/types/providers/home';
type Emit = {
    (e: 'update:product', product: Product): void;
};

defineEmits<Emit>();

const { templateInformation } = inject(
    templateInformationProviderKey
) as TemplateInformationProvider;
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="text=[#101010] font-bold">Hinzugefügt</div>

        <!-- @vue-ignore -->
        <Dnd v-model="templateInformation.products" handle=".drag-handle">
            <template #item="{ item: product, cssClass }">
                <ProductCard
                    :product="(product as Product)"
                    :class="[cssClass]"
                    @update:product="(product: Product) => $emit('update:product', product)"
                />
            </template>
        </Dnd>
    </div>
</template>
