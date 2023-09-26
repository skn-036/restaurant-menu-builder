<script setup lang="ts">
import {
    CSSProperties,
    computed,
    ref,
    watch,
    nextTick,
    onMounted,
    DefineComponent,
    PropType,
} from 'vue';

// 3rd party
import { cloneDeep } from 'lodash';

type Props = {
    pageWidth: number;
    pageHeight: number;
    pageMargin: number;
    templateInformation: TemplateInformation;
    productComponent: DefineComponent<
        {
            product: {
                type: PropType<Product>;
                required: true;
            };
        },
        {},
        unknown,
        {},
        {}
    >;
    restaurantComponent: DefineComponent<
        {
            restaurantInformation: {
                type: PropType<RestaurantInformation>;
                required: true;
            };
        },
        {},
        unknown,
        {},
        {}
    >;
    templateComponent: DefineComponent;
};

type Emit = {
    (e: 'update:page', pages: (RestaurantInformation | Product)[][]): void;
    (e: 'update:template-string', htmlString: string): void;
};

import {
    TemplateInformation,
    Product,
    RestaurantInformation,
} from '@/types/home/home';

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const previewStyle = computed<CSSProperties>(() => {
    return {
        width: `${props.pageWidth}px`,
        height: `${props.pageHeight}px`,
        padding: `${props.pageMargin}px`,
    };
});

const preview_builder = ref<HTMLDivElement | null>(null);

const page = ref<number>(0);
const newPreviewPages = ref<(RestaurantInformation | Product)[][]>([[]]);
const activePreviewPage = ref<(RestaurantInformation | Product)[]>(
    newPreviewPages.value[page.value]
);

const isRestaurantInformationDefined = computed(() =>
    Boolean(
        props.templateInformation.restaurant_information.name ||
            props.templateInformation.restaurant_information.logo ||
            props.templateInformation.restaurant_information.description
    )
);

const generatePreviewPages = async () => {
    if (!preview_builder.value) return;

    const ALLOWABLE_HEIGHT = props.pageHeight - 2 * props.pageMargin - 14;

    page.value = 0;
    newPreviewPages.value = [[]];
    activePreviewPage.value = newPreviewPages.value[page.value];

    const products = [...props.templateInformation.products];

    if (page.value === 0) {
        if (isRestaurantInformationDefined.value) {
            activePreviewPage.value = activePreviewPage.value.concat([
                props.templateInformation.restaurant_information,
            ]);
            await nextTick();
        }

        if (!products.length) {
            newPreviewPages.value = newPreviewPages.value.map(
                (previewPage, index) => {
                    if (index === page.value) return activePreviewPage.value;
                    return previewPage;
                }
            );
            emit('update:page', newPreviewPages.value);
            return;
        }
    }

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        activePreviewPage.value = activePreviewPage.value.concat([product]);
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
            newPreviewPages.value = newPreviewPages.value.concat([[product]]);
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
            emit('update:page', newPreviewPages.value);
        }
    }
};

const templateString = ref('');
const generateTemplateString = async () => {
    await nextTick();
    setTimeout(() => {
        const container = document.querySelector('#template-string-builder');
        if (!container) return;
        templateString.value = container.innerHTML;
        emit('update:template-string', templateString.value);
    }, 500);
};

onMounted(() => {
    generatePreviewPages();
    generateTemplateString();
});
watch(
    () => cloneDeep(props.templateInformation),
    () => {
        generatePreviewPages();
        generateTemplateString();
    }
);
</script>

<template>
    <Teleport to="body">
        <!-- page generator -->
        <div
            :style="previewStyle"
            class="border border-gray-300 bg-yellow-200 fixed top-[120vh] left-[-120vw]"
        >
            <div ref="preview_builder">
                <Component :is="templateComponent">
                    <template v-for="item in activePreviewPage">
                        <!-- @vue-ignore -->
                        <Component
                            :is="
                                item?.price
                                    ? productComponent
                                    : restaurantComponent
                            "
                            :product="(item as Product)"
                            :restaurant-information="(item as RestaurantInformation)"
                        />
                    </template>
                </Component>
            </div>
        </div>

        <!-- page string generator -->
        <div
            :style="{ ...previewStyle, height: 'auto' }"
            class="border border-gray-300 bg-pink-200 fixed top-[120vh] left-[-120vw]"
        >
            <div id="template-string-builder">
                <Component :is="templateComponent">
                    <Component
                        v-if="isRestaurantInformationDefined"
                        :is="restaurantComponent"
                        :restaurant-information="
                            templateInformation.restaurant_information
                        "
                    />

                    <template v-for="product in templateInformation.products">
                        <Component :is="productComponent" :product="product" />
                    </template>
                </Component>
            </div>
        </div>
    </Teleport>
</template>
