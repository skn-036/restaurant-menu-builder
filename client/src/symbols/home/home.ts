import type { InjectionKey } from 'vue';
import {
    ProductProvider,
    TemplateInformationProvider,
    TemplateProvider,
} from '@/types/providers/home';

export const productProviderKey = Symbol() as InjectionKey<ProductProvider>;
export const templateInformationProviderKey =
    Symbol() as InjectionKey<TemplateInformationProvider>;
export const templateProviderKey = Symbol() as InjectionKey<TemplateProvider>;
