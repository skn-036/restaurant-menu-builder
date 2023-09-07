<script setup lang="ts">
import { computed, inject, CSSProperties, ref, watch, onMounted } from 'vue';

// components
import ItemBuilder from '@/components/pages/template-builder/ItemBuilder.vue';
import ItemStyle from '@/components/pages/template-builder/ItemStyle.vue';

// composables
import useCreateTemplate from '@/composables/template/useCreateTemplate';
import useCommonUtils from '@/composables/utils/useCommonUtils';
import useFile from '@/composables/files/useFile';

// types
import { RestaurantProvider } from '@/types/providers/template-builder';
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
import { RestaurantProviderKey } from '@/symbols/template-builder/template-builder';
import { appConfigProviderKey } from '@/symbols/app';

// props
const props = defineProps<Props>();

// injections
const {
    dynamicRestaurantTemplate,
    restaurantTemplate,
    activeRestaurantTemplate,
    onRestaurantTemplateUpdate,
    onActiveRestaurantTemplateUpdate,
} = inject(RestaurantProviderKey) as RestaurantProvider;

const { windowWidth } = inject(appConfigProviderKey) as AppConfig;

/**
 * ----------------------------------------------------------------------------------------
 * composable extractions
 * ----------------------------------------------------------------------------------------
 */
const BUILDER = 'restaurant';
const { generateHtml, wrapper, title, image } = useCreateTemplate(BUILDER);
const { generateId } = useCommonUtils();
const { resolvePathUrl } = useFile();

/**
 * ----------------------------------------------------------------------------------------
 * Rendering html
 * ----------------------------------------------------------------------------------------
 */
const render = computed(() => generateHtml(dynamicRestaurantTemplate.value));

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
        scale: previewWidth.value / PAGEWIDTH,
        transformOrigin: 'left top',
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
        class: `${wrapper.value.class} restaurant-wrapper`,
        title: 'Wrapper element',
    };
    const titleItem: TemplateBuilderItem = {
        ...title.value,
        id: generateId('restaurant_title-'),
        class: `${title.value.class} restaurant-title`,
        style: { ...title.value.style, fontSize: '30px' },
        title: 'Restaurant title',
    };
    const imageItem: TemplateBuilderItem = {
        ...image.value,
        id: generateId('restaurant_logo-'),
        class: `${image.value.class} restaurant-logo`,
        attrs: {
            ...image.value.attrs,
            src: resolvePathUrl('images/demo-logo.jpg'),
        },
        title: 'Restaurant logo',
    };
    const descriptionItem: TemplateBuilderItem = {
        ...title.value,
        id: generateId('restaurant_description-'),
        class: `${title.value.class} restaurant-description`,
        style: {
            ...title.value.style,
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: '400',
        },
        title: 'Restaurant description',
        content:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia officiis dicta odio assumenda numquam reprehenderit dolore. Optio id itaque laboriosam aperiam. Culpa enim vitae quod odio quo sunt dolorum delectus.',
    };

    return [wrapperItem, titleItem, imageItem, descriptionItem];
});

const onBuilderItemUpdate = (
    template: TemplateBuilderItem,
    activeTemplate?: TemplateBuilderItem
) => {
    onRestaurantTemplateUpdate(template);
    if (activeTemplate) onActiveRestaurantTemplateUpdate(activeTemplate);
};
</script>

<template>
    <div class="w-full grid grid-cols-12 gap-4 h-full">
        <div class="col-span-12 lg:col-span-3 h-full py-6">
            <ItemBuilder
                :builder-items="builderItems"
                :template="restaurantTemplate"
                :active-template="activeRestaurantTemplate"
                title="Restaurant template components"
                @update-builder-item="
                    (template, activeTemplate) =>
                        onBuilderItemUpdate(template, activeTemplate)
                "
                @update-active-template="
                    updateTemplate =>
                        onActiveRestaurantTemplateUpdate(updateTemplate)
                "
            />
        </div>
        <div
            ref="preview"
            class="col-span-12 lg:col-span-6 border-x border-gray-300 px-4 h-full py-6"
        >
            <div id="restuarant-template-builder" :style="containerStyle">
                <render />
            </div>
        </div>
        <div class="col-span-12 lg:col-span-3 h-full py-6">
            <ItemStyle
                :template="restaurantTemplate"
                :active-template="activeRestaurantTemplate"
                @update-builder-item="
                    (template, activeTemplate) =>
                        onBuilderItemUpdate(template, activeTemplate)
                "
            />
        </div>
    </div>
</template>
