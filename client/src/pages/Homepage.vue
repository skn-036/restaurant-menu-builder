<script setup lang="ts">
import { ref, provide, watch, inject, onBeforeMount } from 'vue';
import { Button } from '@/components/ui/buttons';
import { Title } from '@/components/ui/components';
import {
    AddRestuarantInformation,
    FoodAndDrinks,
    Pagination,
} from '@/components/pages/home';

import useHttpRequest from '@/composables/request/useHttpRequest';
import useEnv from '@/composables/env/useEnv';
import useTemplate from '@/composables/template/useTemplate';

import { cloneDeep } from 'lodash';

// types and injection symbols
import {
    Product,
    TemplateInformation,
    Template,
    PageSize,
} from '@/types/home/home';
import { AppConfig } from '@/types/layout/app';

import {
    productProviderKey,
    templateInformationProviderKey,
    templateProviderKey,
} from '@/symbols/home/home';
import { appConfigProviderKey } from '@/symbols/app';

import defaultTemplates from '@/data/templates';

// @ts-ignore
const { windowWidth } = inject(appConfigProviderKey) as AppConfig;
const { pageSizes, resolveTemplateString } = useTemplate();
const { save: generatePreview, saving: previewLoading } =
    useHttpRequest('api/pdf/preview');
const { env } = useEnv();

/**
 * -----------------------------------------------------------------------------
 * template data...
 * -----------------------------------------------------------------------------
 */
const templates = ref<Template[]>([...defaultTemplates]);
const templateInformation = ref<TemplateInformation>({
    pageSize: pageSizes.find(pageSize => pageSize.size === 'A4') as PageSize,
    template: defaultTemplates[0],
    restaurant_information: {
        name: null,
        description: '',
        logo: null,
    },
    products: [],
});

const resolvedTemplateString = ref<string>('');

const onUpdateTemplateInformation = (
    updatedTemplateInformation: TemplateInformation
) => {
    templateInformation.value = updatedTemplateInformation;
};

watch(
    () => cloneDeep(templateInformation.value),
    async () => {
        resolvedTemplateString.value = resolveTemplateString(
            templateInformation.value
        );
        const response = await generatePreview<string[]>({
            body: resolvedTemplateString.value,
            templateInformation: {
                ...templateInformation.value,
                products: [templateInformation.value.products]
                    .concat(products.value)
                    .concat(products.value),
            },
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
        <div
            v-if="previewLoading"
            class="fixed top-24 left-1/2 z-20 px-4 py-2 bg-gradient text-white text-sm font-semibold rounded-md"
        >
            Vorschau wird geladen...
        </div>
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

                    <Button label="Drucken">
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

        <!-- <img src="http://127.0.0.1:5000/images/bg-menu.png" /> -->

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
                        :src="templateInformation.template.background"
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
            <!-- <div
                class="col-span-2 lg:col-span-1 rounded-md w-full h-[1015px] bg-[#5E4D47] relative overflow-hidden"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="656"
                    height="387"
                    viewBox="0 0 656 387"
                    fill="none"
                    class="w-[1120px] h-[400px] left-[-216px] absolute z-0"
                >
                    <path
                        d="M908.5 -12.6711L990.5 -12.9483C922.81 -9.93829 750 413.035 592 385.5C537.997 376.089 496.525 292.25 440 264C378.751 233.391 329.315 275.759 274.038 298.654C203.676 327.799 167 230.29 72.1981 253.414C-24.5001 277 -189.5 498.5 -108.5 158.5L-12.5 36L-12.5 -2L741.994 -12.9483C746.508 -12.9483 792.994 -13.1776 792.994 -12.6711L908.5 -12.6711Z"
                        fill="#AB8D82"
                    />
                </svg>

                <div
                    class="z-10 relative w-full h-full font-league-spartan p-10"
                >
                    <div class="w-full flex-column text-app-white h-[400px]">
                        <div class="flex-end gap-8">
                            <h2 class="p-0 m-0 text-[40px] font-bold">
                                Pizza & Pinsa
                            </h2>

                            <img
                                :src="
                                    resolvePathUrl('images/Imagecafe_title.png')
                                "
                                alt="cate title"
                                class="w-[75px] h-[75px] rounded-full"
                            />
                        </div>

                        <div
                            class="ml-4 sm:ml-8 lg:ml-16 xl:ml-24 text-right mt-6 text-[18px] font-bold leading-[1.33]"
                        >
                            Tauchen Sie ein in die Welt der Pizza und Pinsas und
                            lassen Sie sich von den köstlichen Kreationen
                            unserer Gastronomie verführen. Unsere handgemachten
                            Pizzen und Pinsas sind wahre Genussmomente, die
                            Ihren Gaumen verwöhnen und Ihr Herz höherschlagen
                            lassen.
                        </div>
                    </div>
                </div>
            </div> -->

            <div class="flex-1 flex flex-col gap-4">
                <AddRestuarantInformation />

                <FoodAndDrinks />
            </div>
        </section>
    </div>
</template>
