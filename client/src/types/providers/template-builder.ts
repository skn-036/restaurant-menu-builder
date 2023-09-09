import type { Ref, ComputedRef } from 'vue';
import { TemplateBuilderItem } from '@/types/home/home';

export type RestaurantProvider = {
    dynamicRestaurantTemplate: ComputedRef<TemplateBuilderItem>;
    restaurantTemplate: Ref<TemplateBuilderItem>;
    activeRestaurantTemplate: Ref<TemplateBuilderItem>;
    restauranTemplateString: Ref<string>;
    onRestaurantTemplateUpdate: (updatedTemplate: TemplateBuilderItem) => void;
    onActiveRestaurantTemplateUpdate: (
        updatedActiveTemplate: TemplateBuilderItem
    ) => void;
    onRestaurantTemplateStringUpdate: (templateString: string) => void;
};

export type ProductProvider = {
    dynamicProductTemplate: ComputedRef<TemplateBuilderItem>;
    productTemplate: Ref<TemplateBuilderItem>;
    activeProductTemplate: Ref<TemplateBuilderItem>;
    productTemplateString: Ref<string>;
    onProductTemplateUpdate: (updatedTemplate: TemplateBuilderItem) => void;
    onActiveProductTemplateUpdate: (
        updatedActiveTemplate: TemplateBuilderItem
    ) => void;
    onProductTemplateStringUpdate: (templateString: string) => void;
};
