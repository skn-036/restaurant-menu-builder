import { CSSProperties } from 'vue';

export type TemplateBuilderItem = {
    id: string;
    title?: string;
    tag: string;
    componentType: 'container' | 'wrapper' | 'text' | 'image';
    class?: string;
    style: CSSProperties;
    dynamicStyle: CSSProperties;
    content?: string;
    children: TemplateBuilderItem[];
    props: Record<string, any>;
    attrs: Record<string, any>;
    canAddChild: boolean;
};

export type Template = {
    id: string;
    name: string;
    background?: string;
    container?: string;
    restaurant?: string;
    product?: string;
};

export type RestaurantInformation = {
    name: string | null;
    description?: string | number | string[] | undefined;
    logo?: string | null;
};

export type Product = {
    id: string;
    name: string | null;
    price: string | number | null;
    description?: string | number | string[] | undefined;
    logo?: string | null;
    link?: string | null;
};

export type PageSize = {
    size: 'A4' | 'A5';
    width: number;
    height: number;
};

export type TemplateInformation = {
    pageSize: PageSize;
    template: Template;
    restaurant_information: RestaurantInformation;
    products: Product[];
};
