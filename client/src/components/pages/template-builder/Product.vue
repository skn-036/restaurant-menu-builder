<script setup lang="ts">
import {
    computed,
    inject,
    CSSProperties,
    ref,
    watch,
    onMounted,
    nextTick,
} from 'vue';

// components
import ItemBuilder from '@/components/pages/template-builder/ItemBuilder.vue';
import ItemStyle from '@/components/pages/template-builder/ItemStyle.vue';

// assets
import logoUrl from '@/assets/images/product-logo.jpg';

// composables
import useCreateTemplate from '@/composables/template/useCreateTemplate';
import useCommonUtils from '@/composables/utils/useCommonUtils';

// 3rd party
import { cloneDeep } from 'lodash';

// types
import { ProductProvider } from '@/types/providers/template-builder';
import { TemplateBuilderItem } from '@/types/home/home';

import { Template } from '@/types/home/home';
import { UiTab } from '@/types/ui/ui';
import { AppConfig } from '@/types/layout/app';

type Tab = UiTab & {
    tab: 'template_information' | 'restaurant_information' | 'product';
};

type Props = {
    tab: Tab;
    templateData: Template;
};

// symbols
import { ProductProviderKey } from '@/symbols/template-builder/template-builder';
import { appConfigProviderKey } from '@/symbols/app';

// props
const props = defineProps<Props>();

// injections
const {
    dynamicProductTemplate,
    productTemplate,
    activeProductTemplate,
    onProductTemplateUpdate,
    onActiveProductTemplateUpdate,
    onProductTemplateStringUpdate,
} = inject(ProductProviderKey) as ProductProvider;

const { windowWidth } = inject(appConfigProviderKey) as AppConfig;

/**
 * ----------------------------------------------------------------------------------------
 * composable extractions
 * ----------------------------------------------------------------------------------------
 */
const BUILDER = 'product';
const { generateHtml, setTemplateString, wrapper, title, image } =
    useCreateTemplate(BUILDER);
const { generateId } = useCommonUtils();

/**
 * ----------------------------------------------------------------------------------------
 * Rendering html
 * ----------------------------------------------------------------------------------------
 */
const render = computed(() => generateHtml(dynamicProductTemplate.value));

const preview = ref<HTMLDivElement | null>(null);
const PAGEWIDTH = 795; // 795 A4 width
const previewWidth = ref(PAGEWIDTH);
onMounted(() => {
    if (preview.value) previewWidth.value = preview.value.clientWidth - 28; // padding and margin
});
watch(
    () => windowWidth.value,
    () => {
        if (preview.value) previewWidth.value = preview.value.clientWidth - 28; // padding and margin
    }
);

const containerStyle = computed<CSSProperties>(() => {
    let style: CSSProperties = {
        width: `${PAGEWIDTH}px`,
        padding: '72px',
        scale: previewWidth.value / PAGEWIDTH,
        transformOrigin: 'left top',
        height: '842px',
    };
    if (props.templateData.background)
        style = {
            ...style,
            backgroundImage: `url('${props.templateData.background}')`,
        };
    else style = { ...style, background: '#ffffff' };

    return style;
});

/**
 * ----------------------------------------------------------------------------------------
 * Template builder(left panel)
 * ----------------------------------------------------------------------------------------
 */
const builderItems = computed<TemplateBuilderItem[]>(() => {
    const wrapperItem: TemplateBuilderItem = {
        ...wrapper.value,
        id: generateId('wrapper-'),
        class: `${wrapper.value.class} product-wrapper`,
        title: 'Wrapper element',
    };
    const titleItem: TemplateBuilderItem = {
        ...title.value,
        id: generateId('product_title-'),
        class: `${title.value.class} product-title`,
        style: { ...title.value.style, fontSize: '22px', lineHeight: '30px' },
        title: 'Product title',
        content: 'Product title',
    };
    const imageItem: TemplateBuilderItem = {
        ...image.value,
        id: generateId('product_logo-'),
        class: `${image.value.class} product-logo`,
        attrs: {
            ...image.value.attrs,
            src: logoUrl,
        },
        title: 'Product logo',
    };
    const descriptionItem: TemplateBuilderItem = {
        ...title.value,
        id: generateId('product_description-'),
        class: `${title.value.class} product-description`,
        style: {
            ...title.value.style,
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: '400',
        },
        title: 'Product description',
        content:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia officiis dicta odio assumenda numquam reprehenderit dolore.',
    };

    const priceItem: TemplateBuilderItem = {
        ...title.value,
        id: generateId('product_price-'),
        class: `${title.value.class} product-price`,
        style: { ...title.value.style, fontSize: '20px', lineHeight: '28px' },
        title: 'Product price',
        content: '$99',
    };

    return [wrapperItem, titleItem, imageItem, descriptionItem, priceItem];
});

const onBuilderItemUpdate = (
    template: TemplateBuilderItem,
    activeTemplate?: TemplateBuilderItem
) => {
    onProductTemplateUpdate(template);
    if (activeTemplate) onActiveProductTemplateUpdate(activeTemplate);
};

/**
 * ----------------------------------------------------------------------------------------
 * template string
 * ----------------------------------------------------------------------------------------
 */
const updateTemplateString = async () => {
    await nextTick();
    const str = setTemplateString(productTemplate.value);
    onProductTemplateStringUpdate(str);
};
updateTemplateString();
watch(
    () => cloneDeep(productTemplate.value),
    () => {
        updateTemplateString();
    }
);
</script>

<template>
    <div class="w-full grid grid-cols-12 gap-4 h-full border-t border-gray-300">
        <div class="col-span-12 lg:col-span-3 h-full py-6">
            <ItemBuilder
                :builder-items="builderItems"
                :template="productTemplate"
                :active-template="activeProductTemplate"
                title="Restaurant template components"
                @update-builder-item="
                    (template, activeTemplate) =>
                        onBuilderItemUpdate(template, activeTemplate)
                "
                @update-active-template="
                    updateTemplate =>
                        onActiveProductTemplateUpdate(updateTemplate)
                "
            />
        </div>
        <div
            ref="preview"
            class="col-span-12 lg:col-span-6 border-x border-gray-300 px-4 h-full py-6"
        >
            <div id="product-template-builder" :style="containerStyle">
                <render />
            </div>
        </div>
        <div class="col-span-12 lg:col-span-3 h-full py-6">
            <ItemStyle
                :template="productTemplate"
                :active-template="activeProductTemplate"
                @update-builder-item="
                    (template, activeTemplate) =>
                        onBuilderItemUpdate(template, activeTemplate)
                "
            />
        </div>
    </div>
</template>
