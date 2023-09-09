<script setup lang="ts">
import { inject } from 'vue';
import { ProductCard } from '@/components/pages/home';
import { SmoothDnd } from '@/components/ui/drag';

import { Product } from '@/types/home/home';
import { templateInformationProviderKey } from '@/symbols/home/home';
import { TemplateInformationProvider } from '@/types/providers/home';
type Emit = {
    (e: 'update:product', product: Product): void;
};

defineEmits<Emit>();

const { templateInformation, onUpdateTemplateInformation } = inject(
    templateInformationProviderKey
) as TemplateInformationProvider;

const onDrop = (products: Product[]) => {
    const updatedTemplateInformation = {
        ...templateInformation.value,
        products,
    };
    onUpdateTemplateInformation(updatedTemplateInformation);
};
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="text=[#101010] font-bold">Hinzugefügt</div>

        <SmoothDnd
            :options="templateInformation.products"
            drag-handle-selector=".drag-handle"
            ghost-preview-background="#d1d1d1"
            @drop="(products: Product[]) => onDrop(products)"
        >
            <template #option="{ option: product }">
                <ProductCard
                    :product="product"
                    @update:product="(product: Product) => $emit('update:product', product)"
                />
            </template>
        </SmoothDnd>
    </div>
</template>
