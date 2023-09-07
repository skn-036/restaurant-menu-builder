import type { InjectionKey } from 'vue';
import {
    RestaurantProvider,
    ProductProvider,
} from '@/types/providers/template-builder';

export const RestaurantProviderKey =
    Symbol() as InjectionKey<RestaurantProvider>;
export const ProductProviderKey = Symbol() as InjectionKey<ProductProvider>;
