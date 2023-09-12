<script setup lang="ts">
import {
    defineAsyncComponent,
    computed,
    ref,
    provide,
    // watchEffect,
    nextTick,
    watch,
} from 'vue';

// components
import Tab from '@/components/ui/tab/Tab.vue';
import Button from '@/components/ui/buttons/Button.vue';

// composables
import useCreateTemplate from '@/composables/template/useCreateTemplate';
import useHttpRequest from '@/composables/request/useHttpRequest';

// 3rd party import
import { v4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { useToast } from 'vue-toastification';

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
    templateString: restauranTemplateString,
    resetTemplate: resetRestaurantTemplate,
} = useCreateTemplate('restaurant');

const {
    dynamicTemplate: dynamicProductTemplate,
    template: productTemplate,
    activeTemplate: activeProductTemplate,
    templateString: productTemplateString,
    resetTemplate: resetProductTemplate,
} = useCreateTemplate('product');

const toast = useToast();
const { save: saveTemplate } = useHttpRequest('/api/templates');

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

/**
 * ----------------------------------------------------------------------------------------
 * Data collection
 * ----------------------------------------------------------------------------------------
 */
const templateData = ref<Template>({
    id: `template-${v4()}`,
    name: '',
    background: '',
    container: `<div class="page-root [{page_root_class}]" style="[{page_root_style}]">
        <div style="width: 100%;">[{restaurant_template}]</div>
        <div style="width: 100%;">[{product_template}]</div>
    </div>`,
    restaurant: '',
    restaurantBuilder: restaurantTemplate.value,
    product: '',
    productBuilder: productTemplate.value,
});

watch(
    () => restauranTemplateString.value,
    () => {
        templateData.value = {
            ...templateData.value,
            restaurant: restauranTemplateString.value,
        };
        console.log(restauranTemplateString.value, 'rs');
    }
);
watch(
    () => cloneDeep(restaurantTemplate.value),
    () => {
        templateData.value = {
            ...templateData.value,
            restaurantBuilder: restaurantTemplate.value,
        };
        console.log(restaurantTemplate.value, 'r');
    }
);
watch(
    () => productTemplateString.value,
    () => {
        templateData.value = {
            ...templateData.value,
            product: productTemplateString.value,
        };
        console.log(productTemplateString.value, 'ps');
    }
);
watch(
    () => cloneDeep(productTemplate.value),
    () => {
        templateData.value = {
            ...templateData.value,
            productBuilder: productTemplate.value,
        };
        console.log(productTemplate.value, 'p');
    }
);
// watchEffect(() => {
//     templateData.value = {
//         ...templateData.value,
//         restaurant: restauranTemplateString.value,
//         restaurantBuilder: restaurantTemplate.value,
//         product: productTemplateString.value,
//         productBuilder: productTemplate.value,
//     };
// });

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
const onRestaurantTemplateStringUpdate = (templateString: string) => {
    restauranTemplateString.value = templateString;
};
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
const onProductTemplateStringUpdate = (templateString: string) => {
    productTemplateString.value = templateString;
};

/**
 * ----------------------------------------------------------------------------------------
 * saving the template
 * ----------------------------------------------------------------------------------------
 */
const onSaveTemplate = async () => {
    if (!templateData.value.name) {
        toast.info('Template name is required...');
        return;
    }

    if (
        !templateData.value.restaurant ||
        !templateData.value.restaurantBuilder.children.length
    ) {
        toast.info('Restaurant template is not set...');
        return;
    }

    if (
        !templateData.value.product ||
        !templateData.value.productBuilder.children.length
    ) {
        toast.info('Product template is not set...');
        return;
    }

    const template = await saveTemplate<Template>({ ...templateData.value });
    if (template?.id) {
        toast.info('Template created...');

        templateData.value = {
            ...templateData.value,
            id: `template-${v4()}`,
            name: '',
            background: '',
            container: `<div class="page-root [{page_root_class}]" style="[{page_root_style}]">
                <div style="width: 100%;">[{restaurant_template}]</div>
                <div style="width: 100%;">[{product_template}]</div>
            </div>`,
            restaurant: '',
            product: '',
        };
        await nextTick();
        resetRestaurantTemplate();

        await nextTick();
        resetProductTemplate();
    }
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
    restauranTemplateString,
    onRestaurantTemplateUpdate,
    onActiveRestaurantTemplateUpdate,
    onRestaurantTemplateStringUpdate,
});

provide(ProductProviderKey, {
    dynamicProductTemplate,
    productTemplate,
    activeProductTemplate,
    productTemplateString,
    onProductTemplateUpdate,
    onActiveProductTemplateUpdate,
    onProductTemplateStringUpdate,
});
</script>

<template>
    <div class="py-8">
        <Tab
            :tabs="tabs"
            :active-tab="activeTab"
            @on-tab-change="((tab: Tab) => (activeTab = tab))"
        >
            <template #default="{ activeTab: tab }">
                <Component
                    :is="components[activeTab.tab]"
                    :tab="(tab as Tab)"
                    :template-data="templateData"
                    @update:template-data="(data: Template) => (templateData = data)"
                    @go-to-tab="onGoToTab"
                />
            </template>

            <template #after_tab_button>
                <Button label="Save template..." @click="onSaveTemplate" />
            </template>
        </Tab>
    </div>
</template>
