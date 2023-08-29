import type { Ref } from 'vue';
import { Product, TemplateInformation, Template } from '@/types/home/home';

export type ProductProvider = {
    products: Ref<Product[]>;
    onUpdateProducts: (products: Product[]) => void;
    onUpdateProduct: (product: Product) => void;
};

export type TemplateInformationProvider = {
    templateInformation: Ref<TemplateInformation>;
    onUpdateTemplateInformation: (
        templateInformation: TemplateInformation
    ) => void;
};

export type TemplateProvider = {
    templates: Ref<Template[]>;
};
