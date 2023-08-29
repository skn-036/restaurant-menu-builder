import { InjectionKey } from 'vue';
import { AppConfig } from '@/types/layout/app';

export const appConfigProviderKey = Symbol() as InjectionKey<AppConfig>;
