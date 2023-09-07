import type { Ref, ComputedRef } from 'vue';
import { TemplateBuilderItem } from '@/types/home/home';

export type RestaurantProvider = {
    dynamicRestaurantTemplate: ComputedRef<TemplateBuilderItem>;
    restaurantTemplate: Ref<TemplateBuilderItem>;
    activeRestaurantTemplate: Ref<TemplateBuilderItem>;
    onRestaurantTemplateUpdate: (updatedTemplate: TemplateBuilderItem) => void;
    onActiveRestaurantTemplateUpdate: (
        updatedActiveTemplate: TemplateBuilderItem
    ) => void;
};

export type ProductProvider = {
    dynamicProductTemplate: ComputedRef<TemplateBuilderItem>;
    productTemplate: Ref<TemplateBuilderItem>;
    activeProductTemplate: Ref<TemplateBuilderItem>;
    onProductTemplateUpdate: (updatedTemplate: TemplateBuilderItem) => void;
    onActiveProductTemplateUpdate: (
        updatedActiveTemplate: TemplateBuilderItem
    ) => void;
};
