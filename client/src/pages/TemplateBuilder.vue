<script setup lang="ts">
import { defineAsyncComponent, computed, ref, watch, provide } from 'vue';

// components
import Tab from '@/components/ui/tab/Tab.vue';

// composables
import useCreateTemplate from '@/composables/template/useCreateTemplate';

// 3rd party import
import { v4 } from 'uuid';
import { cloneDeep } from 'lodash';

// types
import { UiTab } from '@/types/ui/ui';
import { Template, TemplateBuilderItem } from '@/types/home/home';

type Tab = UiTab & {
    tab: 'template_information' | 'restaurant_information' | 'product';
};

// symbols
import {
    RestaurantProviderKey,
    ProductProviderKey,
} from '@/symbols/template-builder/template-builder';

/**
 * ----------------------------------------------------------------------------------------
 * Composables extraction
 * ----------------------------------------------------------------------------------------
 */
const {
    dynamicTemplate: dynamicRestaurantTemplate,
    template: restaurantTemplate,
    activeTemplate: activeRestaurantTemplate,
} = useCreateTemplate('restaurant');

const {
    dynamicTemplate: dynamicProductTemplate,
    template: productTemplate,
    activeTemplate: activeProductTemplate,
} = useCreateTemplate('product');

/**
 * ----------------------------------------------------------------------------------------
 * Tabs
 * ----------------------------------------------------------------------------------------
 */
const components = {
    template_information: defineAsyncComponent(
        () =>
            import(
                '@/components/pages/template-builder/TemplateInformation.vue'
            )
    ),
    restaurant_information: defineAsyncComponent(
        () =>
            import(
                '@/components/pages/template-builder/RestaurantInformation.vue'
            )
    ),
    product: defineAsyncComponent(
        () => import('@/components/pages/template-builder/Product.vue')
    ),
};

const tabs = computed<Tab[]>(() => {
    return [
        { tab: 'template_information', title: 'Template Information' },
        { tab: 'restaurant_information', title: 'Restaurant Information' },
        { tab: 'product', title: 'Product' },
    ];
});

const activeTab = ref<Tab>(tabs.value[0]);

const onGoToTab = (tabName: Tab['tab']) => {
    const newTab = tabs.value.find(tabItem => tabItem.tab === tabName);
    if (!newTab) return;
    activeTab.value = newTab;
};

const isTabDisabled = (tab: UiTab) => {
    return false;
    if (tab.tab === 'template_information') return false;
    else return !Boolean(templateData.value.name);
};

/**
 * ----------------------------------------------------------------------------------------
 * Data collection
 * ----------------------------------------------------------------------------------------
 */
const templateData = ref<Template>({
    id: v4(),
    name: '',
    background: '',
    container: '',
    restaurant: '',
    product: '',
});
watch(
    () => cloneDeep(templateData.value),
    v => console.log(v)
);

/**
 * ----------------------------------------------------------------------------------------
 * Restaurant template builder
 * ----------------------------------------------------------------------------------------
 */
const onRestaurantTemplateUpdate = (updatedTemplate: TemplateBuilderItem) => {
    restaurantTemplate.value = updatedTemplate;
};
const onActiveRestaurantTemplateUpdate = (
    updatedActiveTemplate: TemplateBuilderItem
) => {
    activeRestaurantTemplate.value = updatedActiveTemplate;
};
watch(
    () => cloneDeep(activeRestaurantTemplate.value),
    () => console.log('ehl', activeRestaurantTemplate.value.id)
);
/**
 * ----------------------------------------------------------------------------------------
 * product template builder
 * ----------------------------------------------------------------------------------------
 */
const onProductTemplateUpdate = (updatedTemplate: TemplateBuilderItem) => {
    productTemplate.value = updatedTemplate;
};
const onActiveProductTemplateUpdate = (
    updatedActiveTemplate: TemplateBuilderItem
) => {
    activeProductTemplate.value = updatedActiveTemplate;
};

/**
 * ----------------------------------------------------------------------------------------
 * providers
 * ----------------------------------------------------------------------------------------
 */
provide(RestaurantProviderKey, {
    dynamicRestaurantTemplate,
    restaurantTemplate,
    activeRestaurantTemplate,
    onRestaurantTemplateUpdate,
    onActiveRestaurantTemplateUpdate,
});

provide(ProductProviderKey, {
    dynamicProductTemplate,
    productTemplate,
    activeProductTemplate,
    onProductTemplateUpdate,
    onActiveProductTemplateUpdate,
});
</script>

<template>
    <div class="py-8">
        <Tab
            :tabs="tabs"
            v-slot="{ activeTab: tab }"
            :active-tab="activeTab"
            :disabled="isTabDisabled"
            @on-tab-change="((tab: Tab) => (activeTab = tab))"
        >
            <Component
                :is="components[activeTab.tab]"
                :tab="tab"
                :template-data="templateData"
                @update:template-data="(data: Template) => (templateData = data)"
                @go-to-tab="onGoToTab"
            />
        </Tab>
    </div>
</template>
