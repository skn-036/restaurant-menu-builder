<script setup lang="ts">
import {
    inject,
    CSSProperties,
    computed,
    ref,
    watch,
    nextTick,
    onMounted,
} from 'vue';

// composables
import useTemplate from '@/composables/template/useTemplate';

// 3rd party
import { cloneDeep } from 'lodash';

// types & symbols
import {
    TemplateInformationProvider,
    PreviewProvider,
} from '@/types/providers/home';

import {
    templateInformationProviderKey,
    previewProviderKey,
} from '@/symbols/home/home';

const { templateInformation } = inject(
    templateInformationProviderKey
) as TemplateInformationProvider;

// injection extraction
const {
    // previewPages,
    onUpdatePreviewPages,
    PAGEWIDTH,
    PAGEHEIGHT,
    PAGEMARGIN,
} = inject(previewProviderKey) as PreviewProvider;

// composables extraction
const { resolveRestaurant, resolveProduct } = useTemplate();

const previewStyle = computed<CSSProperties>(() => {
    return {
        width: `${PAGEWIDTH}px`,
        height: `${PAGEHEIGHT}px`,
        padding: `${PAGEMARGIN}px`,
    };
});

const preview_builder = ref<HTMLDivElement | null>(null);

const page = ref<number>(0);
const newPreviewPages = ref<string[][]>([[]]);
const activePreviewPage = ref<string[]>(newPreviewPages.value[page.value]);
const generatePreviewPages = async () => {
    if (!preview_builder.value) return;

    const ALLOWABLE_HEIGHT = PAGEHEIGHT - 2 * PAGEMARGIN - 14;

    page.value = 0;
    newPreviewPages.value = [[]];
    activePreviewPage.value = newPreviewPages.value[page.value];

    const products = [...templateInformation.value.products];

    if (page.value === 0) {
        const restaurantString = resolveRestaurant(templateInformation.value);
        activePreviewPage.value = activePreviewPage.value.concat([
            restaurantString,
        ]);
        await nextTick();
        if (!products.length) {
            newPreviewPages.value = newPreviewPages.value.map(
                (previewPage, index) => {
                    if (index === page.value) return activePreviewPage.value;
                    return previewPage;
                }
            );
            onUpdatePreviewPages(newPreviewPages.value);
            return;
        }
    }

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const productString = resolveProduct(
            templateInformation.value,
            product
        );
        activePreviewPage.value = activePreviewPage.value.concat([
            productString,
        ]);
        await nextTick();
        const height = preview_builder.value.clientHeight;
        if (height > ALLOWABLE_HEIGHT) {
            activePreviewPage.value.pop();
            newPreviewPages.value = newPreviewPages.value.map(
                (previewPage, index) => {
                    if (index === page.value) return activePreviewPage.value;
                    return previewPage;
                }
            );
            newPreviewPages.value = newPreviewPages.value.concat([
                [productString],
            ]);
            page.value = page.value + 1;
            activePreviewPage.value = newPreviewPages.value[page.value];
        }
        if (i === products.length - 1) {
            newPreviewPages.value = newPreviewPages.value.map(
                (previewPage, index) => {
                    if (index === page.value) return activePreviewPage.value;
                    return previewPage;
                }
            );
            onUpdatePreviewPages(newPreviewPages.value);
        }
    }
};

onMounted(() => {
    generatePreviewPages();
});
watch(
    () => cloneDeep(templateInformation.value),
    () => {
        generatePreviewPages();
    }
);

const activePageHtml = computed<string>(() => activePreviewPage.value.join(''));
</script>

<template>
    <Teleport to="body">
        <div
            :style="previewStyle"
            class="border border-gray-300 bg-yellow-200 fixed top-[120vh] left-[-120vw]"
        >
            <div ref="preview_builder" v-html="activePageHtml"></div>
        </div>
    </Teleport>
</template>
