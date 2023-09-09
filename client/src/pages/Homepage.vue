<script setup lang="ts">
import { ref, provide, watch, onBeforeMount } from 'vue';

// components
import { Button } from '@/components/ui/buttons';
import { Title } from '@/components/ui/components';
import {
    AddRestuarantInformation,
    FoodAndDrinks,
    Pagination,
} from '@/components/pages/home';

// composables
import useHttpRequest from '@/composables/request/useHttpRequest';
import useEnv from '@/composables/env/useEnv';
import useTemplate from '@/composables/template/useTemplate';

// 3rd party import
import { cloneDeep } from 'lodash';

// data
import defaultTemplates from '@/data/templates';

// types and injection symbols
import {
    Product,
    TemplateInformation,
    Template,
    PageSize,
} from '@/types/home/home';

import {
    productProviderKey,
    templateInformationProviderKey,
    templateProviderKey,
} from '@/symbols/home/home';

// composables extraction
const { pageSizes } = useTemplate();
const { save: generatePreview, saving: previewLoading } =
    useHttpRequest('/api/pdf/preview');
const { env } = useEnv();

/**
 * -----------------------------------------------------------------------------
 * template data...
 * -----------------------------------------------------------------------------
 */
const { getList: getTemplates } = useHttpRequest('/api/templates');
const templates = ref<Template[]>([]);
const onTemplateGet = async () => {
    templates.value = await getTemplates<Template[]>();
    if (!templateInformation.value.template && templates.value.length) {
        templateInformation.value = {
            ...templateInformation.value,
            template: templates.value[0],
        };
    }
};
onBeforeMount(() => {
    onTemplateGet();
});

const templateInformation = ref<TemplateInformation>({
    pageSize: pageSizes.find(pageSize => pageSize.size === 'A4') as PageSize,
    template: templates.value.length ? templates.value[0] : defaultTemplates[0],
    restaurant_information: {
        name: null,
        description: '',
        logo: null,
    },
    products: [],
});

const onUpdateTemplateInformation = (
    updatedTemplateInformation: TemplateInformation
) => {
    templateInformation.value = updatedTemplateInformation;
};

watch(
    () => cloneDeep(templateInformation.value),
    async () => {
        console.log(templateInformation.value);
        const response = await generatePreview<string[]>({
            templateInformation: templateInformation.value,
        });
        previewPages.value = response?.length ? response : [];

        if (previewPages.value.length) {
            if (!activePreview.value) {
                activePreview.value = previewPages.value[0];
            } else {
                if (
                    !previewPages.value.some(
                        preview => preview === activePreview.value
                    )
                )
                    activePreview.value = previewPages.value[0];
            }
            timestamp.value = Date.now();
        } else {
            activePreview.value = null;
        }
    }
);

/**
 * -----------------------------------------------------------------------------
 * template preview...
 * -----------------------------------------------------------------------------
 */
const previewPages = ref<string[]>([]);
const activePreview = ref<string | null>(null);
const timestamp = ref(Date.now());

/**
 * -----------------------------------------------------------------------------
 * products...
 * -----------------------------------------------------------------------------
 */
const { getList: getProducts } = useHttpRequest('/api/products');
const products = ref<Product[]>([]);
const onProductGet = async () => {
    products.value = await getProducts<Product[]>();
};

onBeforeMount(async () => {
    await onProductGet();
});

const onUpdateProducts = (products: Product[]) => {
    console.log(products);
};

const onUpdateProduct = (product: Product) => {
    console.log(product);
};

/**
 * -----------------------------------------------------------------------------
 * print dialog ...
 * -----------------------------------------------------------------------------
 */
const openPrintDialog = async () => {
    const printWindow = window.open(
        `${env.SERVER_URL}/static/pdf/output.pdf`,
        '_blank'
    );

    // Check if the new window has been blocked
    if (printWindow === null) {
        return;
    }

    printWindow.onload = async () => {
        await new Promise(resolve => {
            printWindow.addEventListener('load', resolve);
        });

        printWindow.print();
    };
};

/**
 * -----------------------------------------------------------------------------
 * pdf generation...
 * -----------------------------------------------------------------------------
 */
// const { save: generatePdf } = useHttpRequest('api/pdf/generate');

// const onPdfGenerate = async () => {
//     const templateString = resolveTemplateString(templateInformation.value);
//     const response = await generatePdf({
//         body: templateString,
//         templateInformation: templateInformation.value,
//     });
//     return response;
// };

/**
 * -----------------------------------------------------------------------------
 * providers...
 * -----------------------------------------------------------------------------
 */
provide(productProviderKey, { products, onUpdateProduct, onUpdateProducts });
provide(templateInformationProviderKey, {
    templateInformation,
    onUpdateTemplateInformation,
});
provide(templateProviderKey, { templates });
</script>

<template>
    <div class="w-full">
        <!-- loading -->
        <section
            v-if="previewLoading"
            class="fixed top-24 left-1/2 z-20 px-4 py-2 bg-gradient text-white text-sm font-semibold rounded-md"
        >
            Vorschau wird geladen...
        </section>

        <!-- top section -->
        <section class="w-full py-8 border-b border-[#d9d9d9]">
            <div class="flex-between mb-2">
                <div>
                    <Title> Speisekartengenerator </Title>

                    <div class="font-medium text-gray">
                        Erstelle in wenigen Klicks deine Speisekarte!
                    </div>
                </div>

                <div class="flex-start gap-4">
                    <a
                        :href="`${env.SERVER_URL}/static/pdf/output.pdf`"
                        target="_blank"
                        download="output.pdf"
                    >
                        <Button label="Exportieren">
                            <template #icon>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15"
                                    height="18"
                                    viewBox="0 0 15 18"
                                    fill="none"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M2.24109 0.25H5.05359C6.77948 0.25 8.17859 1.64911 8.17859 3.375V4.9375C8.17859 5.80044 8.87814 6.5 9.74109 6.5H11.3036C13.0295 6.5 14.4286 7.89911 14.4286 9.625V16.1875C14.4286 17.0504 13.729 17.75 12.8661 17.75H2.24109C1.37814 17.75 0.678589 17.0504 0.678589 16.1875V1.8125C0.678589 0.949555 1.37814 0.25 2.24109 0.25ZM7.99553 8.55806C7.87832 8.44085 7.71935 8.375 7.55359 8.375C7.38783 8.375 7.22886 8.44085 7.11165 8.55806L4.61165 11.0581C4.36757 11.3021 4.36757 11.6979 4.61165 11.9419C4.85572 12.186 5.25145 12.186 5.49553 11.9419L6.92859 10.5089L6.92859 14C6.92859 14.3452 7.20841 14.625 7.55359 14.625C7.89877 14.625 8.17859 14.3452 8.17859 14L8.17859 10.5089L9.61165 11.9419C9.85572 12.186 10.2515 12.186 10.4955 11.9419C10.7396 11.6979 10.7396 11.3021 10.4955 11.0581L7.99553 8.55806Z"
                                        fill="#F4F4F4"
                                    />
                                    <path
                                        d="M9.42859 3.375C9.42859 2.28079 9.02689 1.2804 8.36292 0.513254C11.1954 1.25315 13.4254 3.48323 14.1653 6.31567C13.3982 5.6517 12.3978 5.25 11.3036 5.25H9.74109C9.5685 5.25 9.42859 5.11009 9.42859 4.9375V3.375Z"
                                        fill="#F4F4F4"
                                    />
                                </svg>
                            </template>
                        </Button>
                    </a>

                    <Button label="Drucken" @click="openPrintDialog">
                        <template #icon>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="20"
                                viewBox="0 0 19 20"
                                fill="none"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M5.78585 0C4.79963 0 4.00014 0.799492 4.00014 1.78571V4.63395C3.59405 4.6838 3.18957 4.73889 2.78677 4.79916C1.40196 5.00636 0.428711 6.21108 0.428711 7.57685V13.5714C0.428711 15.1494 1.7079 16.4286 3.28585 16.4286H3.54265L3.39501 18.0526C3.29994 19.0984 4.12333 20 5.17339 20H14.2555C15.3055 20 16.1289 19.0984 16.0338 18.0526L15.8862 16.4286H16.143C17.721 16.4286 19.0001 15.1494 19.0001 13.5714V7.57685C19.0001 6.21108 18.0269 5.00636 16.6421 4.79916C16.2393 4.73889 15.8348 4.6838 15.4287 4.63395V1.78571C15.4287 0.799492 14.6292 0 13.643 0H5.78585ZM14.0001 4.48093V1.78571C14.0001 1.58847 13.8402 1.42857 13.643 1.42857H5.78585C5.58861 1.42857 5.42871 1.58847 5.42871 1.78571V4.48093C6.84012 4.35173 8.26965 4.28571 9.71443 4.28571C11.1592 4.28571 12.5887 4.35173 14.0001 4.48093ZM13.7939 12.352C13.9628 12.3695 14.095 12.5045 14.1104 12.6736L14.6111 18.182C14.6302 18.3911 14.4655 18.5714 14.2555 18.5714H5.17339C4.96338 18.5714 4.7987 18.3911 4.81771 18.182L5.31847 12.6736C5.33384 12.5045 5.4661 12.3695 5.63498 12.352C6.97574 12.2138 8.33669 12.1429 9.71443 12.1429C11.0922 12.1429 12.4531 12.2138 13.7939 12.352ZM14.7144 8.57143C14.7144 8.17694 15.0342 7.85714 15.4287 7.85714H15.4359C15.8303 7.85714 16.1501 8.17694 16.1501 8.57143V8.57857C16.1501 8.97306 15.8303 9.29286 15.4359 9.29286H15.4287C15.0342 9.29286 14.7144 8.97306 14.7144 8.57857V8.57143ZM12.5716 7.85714C12.1771 7.85714 11.8573 8.17694 11.8573 8.57143V8.57857C11.8573 8.97306 12.1771 9.29286 12.5716 9.29286H12.5787C12.9732 9.29286 13.293 8.97306 13.293 8.57857V8.57143C13.293 8.17694 12.9732 7.85714 12.5787 7.85714H12.5716Z"
                                    fill="#F4F4F4"
                                />
                            </svg>
                        </template>
                    </Button>
                </div>
            </div>
        </section>

        <!-- main content -->
        <section class="flex flex-col lg:flex-row gap-4 mt-8">
            <div
                id="pdf"
                :style="{
                    width: `${templateInformation.pageSize.width * 1.12}px`,
                }"
            >
                <div
                    class=""
                    :style="{
                        width: `${templateInformation.pageSize.width * 1.12}px`,
                        height: `${
                            templateInformation.pageSize.height * 1.12
                        }px`,
                    }"
                >
                    <img
                        v-if="!activePreview"
                        :src="
                            templateInformation.template
                                ? templateInformation.template.background
                                : ''
                        "
                        class="w-full h-full rounded-md"
                    />

                    <img
                        v-else
                        class="w-full h-full rounded-md"
                        :src="`${env.SERVER_URL}/static${activePreview}?v=${timestamp}`"
                    />
                </div>

                <div class="w-full mt-4">
                    <Pagination
                        :preview-pages="previewPages"
                        :active-preview="activePreview"
                        @update-page="activePreview = $event"
                    />
                </div>
            </div>

            <div class="flex-1 flex flex-col gap-4">
                <AddRestuarantInformation />

                <FoodAndDrinks />
            </div>
        </section>
    </div>
</template>
