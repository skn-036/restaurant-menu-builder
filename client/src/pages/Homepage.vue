<script setup lang="ts">
/**
 * -----------------------------------------------------------------------------
 * Aliases
 * -----------------------------------------------------------------------------
 * dishes are named as products;
 * organizations are names as restaurant
 *
 * Developer should read in the following code: dishes as products.
 * -----------------------------------------------------------------------------
 * -----------------------------------------------------------------------------
 */
import {
    ref,
    computed,
    watch,
    onBeforeMount,
    onMounted,
    inject,
    CSSProperties,
    defineAsyncComponent,
    DefineComponent,
} from 'vue';

import PreviewBuilder from '@/components/pages/home/PreviewBuilder.vue';
import Pagination from '@/components/pages/home/Pagination.vue';
import Title from '@/components/ui/components/Title.vue';
import Button from '@/components/ui/buttons/Button.vue';
import IconButton from '@/components/ui/buttons/IconButton.vue';
import FormInput from '@/components/ui/form/FormInput.vue';
import FormSelect from '@/components/ui/form/FormSelect.vue';
import FormFileUpload from '@/components/ui/form/FormFileUpload.vue';
import FormFileUpload2 from '@/components/ui/form/FormFileUpload2.vue';
import FormText from '@/components/ui/form/FormText.vue';
import FormTitleError from '@/components/ui/form/FormTitleError.vue';
import SmoothDnd from '@/components/ui/drag/SmoothDnd.vue';

// composables
import useHttpRequest from '@/composables/request/useHttpRequest';
import useTemplate from '@/composables/template/useTemplate';
import useFile from '@/composables/files/useFile';
import useValidation from '@/composables/validation/useValidation';

// 3rd party import
import { v4 } from 'uuid';
import { object as yupObject, string as yupString } from 'yup';

// data
import defaultTemplates from '@/data/templates';

// types and injection symbols
import {
    Product,
    TemplateInformation,
    RestaurantInformation,
    Template,
    PageSize,
} from '@/types/home/home';
import { AppConfig } from '@/types/layout/app';
import { YupValidationError } from '@/types/validation/validation';

import { appConfigProviderKey } from '@/symbols/app';

// composables extraction
const { pageSizes } = useTemplate();
const { openFileStream } = useFile();

// injections
const { windowWidth } = inject(appConfigProviderKey) as AppConfig;

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

/**
 * -----------------------------------------------------------------------------
 * template components...
 * -----------------------------------------------------------------------------
 */
const components = computed(() => {
    return {
        template1: {
            template: defineAsyncComponent(
                () =>
                    import(
                        '@/components/pages/home/placeholder/template-1/Template.vue'
                    )
            ),

            product: defineAsyncComponent(
                () =>
                    import(
                        '@/components/pages/home/placeholder/template-1/Product.vue'
                    )
            ),

            restaurant: defineAsyncComponent(
                () =>
                    import(
                        '@/components/pages/home/placeholder/template-1/Restaurant.vue'
                    )
            ),
        },
    };
});

const productComponent = computed(() => {
    if (templateInformation.value.template.id?.toString() === '1') {
        return components.value.template1.product;
    }
    return components.value.template1.product;
});

const restaurantComponent = computed(() => {
    if (templateInformation.value.template.id?.toString() === '1') {
        return components.value.template1.restaurant;
    }
    return components.value.template1.restaurant;
});

const templateComponent = computed(() => {
    if (templateInformation.value.template.id?.toString() === '1') {
        return components.value.template1.template;
    }
    return components.value.template1.template;
});

/**
 * -----------------------------------------------------------------------------
 * template preview...
 * -----------------------------------------------------------------------------
 */

const PAGEWIDTH = 793;
const PAGEHEIGHT = 1120;
const PAGEMARGIN = 72;
const preview = ref<HTMLDivElement | null>(null);
const previewWidth = ref(PAGEWIDTH);

onMounted(() => {
    if (preview.value) previewWidth.value = preview.value.clientWidth;
});
watch(
    () => windowWidth.value,
    () => {
        if (preview.value) previewWidth.value = preview.value.clientWidth;
    }
);

const previewScale = computed(() => previewWidth.value / PAGEWIDTH);
const previewStyle = computed<CSSProperties>(() => {
    return {
        width: `${PAGEWIDTH}px`,
        height: `${PAGEHEIGHT}px`,
        padding: `${PAGEMARGIN}px`,
        scale: previewScale.value,
        transformOrigin: 'left top',
        backgroundImage: `url('${templateInformation.value.template.background}')`,
    };
});
const paginationStyle = computed<CSSProperties>(() => {
    const transformedHeight = PAGEHEIGHT - PAGEHEIGHT * previewScale.value;
    return {
        transform: `translateY(${-transformedHeight}px)`,
    };
});

const previewPages = ref<(RestaurantInformation | Product)[][]>([[]]);
const onUpdatePreviewPages = (
    newPreviewPages: (RestaurantInformation | Product)[][]
) => {
    previewPages.value = newPreviewPages;
};
const templateString = ref('');
const onUpdateTempalteString = (htmlString: string) => {
    templateString.value = htmlString;
};
/**
 * -----------------------------------------------------------------------------
 * Pagination...
 * -----------------------------------------------------------------------------
 */
const page = ref(0);
const paginationPageLength = computed(() => previewPages.value.length);

const activePage = computed(() => previewPages.value[page.value]);

/**
 * -----------------------------------------------------------------------------
 * products...
 * -----------------------------------------------------------------------------
 */
const { getList: getProducts } = useHttpRequest('/api/dishes');
const products = ref<Product[]>([]);
const onProductGet = async () => {
    products.value = await getProducts<Product[]>();
};

onBeforeMount(async () => {
    await onProductGet();
});

/**
 * -----------------------------------------------------------------------------
 * Add new products
 * -----------------------------------------------------------------------------
 */
const updatingProduct = ref<Product | null>(null);

const { runYupValidation } = useValidation();

const editMode = computed(() => Boolean(updatingProduct.value?.id));
const initialProduct = computed<Product>(() => ({
    id: v4(),
    name: null,
    price: null,
    description: undefined,
    logo: null,
}));

const product = ref<Product>({ ...initialProduct.value });
const selectedProduct = ref<Product | null>(null);
watch(
    () => selectedProduct.value,
    () => {
        if (selectedProduct.value) {
            product.value = { ...selectedProduct.value, id: v4() };
        } else {
            product.value = { ...initialProduct.value, id: v4() };
        }
    }
);
watch(
    () => updatingProduct.value,
    () => {
        if (updatingProduct.value?.id)
            product.value = { ...updatingProduct.value };
    }
);

const formErrors = ref<YupValidationError>({});
const schema = yupObject().shape({
    name: yupString().nullable().required('Name ist erforderlich'),
    price: yupString().nullable().required(),
    description: yupString()
        .nullable()
        .required('Beschreibung ist erforderlich'),
    logo: yupString().nullable().required('Logo ist erforderlich'),
});
const onProductAdd = async () => {
    const { validated, errors } = await runYupValidation(schema, product.value);
    if (!validated) {
        formErrors.value = errors !== undefined ? errors : {};
        return;
    }

    formErrors.value = {};

    if (!editMode.value) {
        const newTemplateInformation = {
            ...templateInformation.value,
            products: templateInformation.value.products.concat([
                product.value,
            ]),
        };
        onUpdateTemplateInformation(newTemplateInformation);
        product.value = { ...initialProduct.value, id: v4() };
        selectedProduct.value = null;
    } else {
        const updatedProducts = templateInformation.value.products.map(
            templateProduct =>
                templateProduct?.id === updatingProduct.value?.id
                    ? product.value
                    : templateProduct
        );
        const newTemplateInformation = {
            ...templateInformation.value,
            products: updatedProducts,
        };
        onUpdateTemplateInformation(newTemplateInformation);
        updatingProduct.value = null;

        product.value = { ...initialProduct.value, id: v4() };
        selectedProduct.value = null;
    }
};

const onDrop = (products: Product[]) => {
    const updatedTemplateInformation = {
        ...templateInformation.value,
        products,
    };
    onUpdateTemplateInformation(updatedTemplateInformation);
};

const onDelete = (product: Product) => {
    const updatedTemplateInformation = {
        ...templateInformation.value,
        products: templateInformation.value.products.filter(
            templateProduct => templateProduct?.id !== product?.id
        ),
    };
    onUpdateTemplateInformation(updatedTemplateInformation);
};

/**
 * -----------------------------------------------------------------------------
 * print dialog ...
 * -----------------------------------------------------------------------------
 */
const { save: generatePrint, saving: generatingPrint } =
    useHttpRequest('/api/print');
const openPrintDialog = async () => {
    const response = await generatePrint<Buffer>(
        {
            templateInformation: templateInformation.value,
            templateString: templateString.value,
        },
        {
            axiosConfig: {
                responseType: 'blob',
            },
        }
    );
    if (response) {
        const url = window.URL.createObjectURL(
            new Blob([response], { type: 'application/pdf' })
        );
        const printWindow = window.open(url, '_blank');

        if (printWindow === null) {
            return;
        }

        printWindow.onload = () => {
            printWindow.print();
        };
    }
};

/**
 * -----------------------------------------------------------------------------
 * pdf generation...
 * -----------------------------------------------------------------------------
 */
const { save: generatePdf, saving: generatingPreview } =
    useHttpRequest('/api/menucard');

const onPdfGenerate = async () => {
    const response = await generatePdf<Buffer>(
        {
            templateInformation: templateInformation.value,
            templateString: templateString.value,
        },
        {
            axiosConfig: {
                responseType: 'blob',
            },
        }
    );
    if (response) {
        openFileStream(response, { type: 'application/pdf' });
    }
};
</script>

<template>
    <div class="w-full">
        <!-- loading -->
        <section
            v-if="generatingPreview || generatingPrint"
            class="fixed top-24 left-1/2 z-20 px-4 py-2 bg-gradient text-white text-sm font-semibold rounded-md"
        >
            Erstellen...
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
                    <Button label="Exportieren" @click="onPdfGenerate">
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

        <!-- dish placeholder -->
        <section class="grid grid-cols-2 gap-4 mt-8">
            <div ref="preview" class="col-span-2 lg:col-span-1 h-max">
                <div
                    :style="previewStyle"
                    class="rounded-md font-league-spartan"
                >
                    <Component :is="templateComponent">
                        <template v-for="item in activePage">
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

                <div class="w-full mt-4" :style="paginationStyle">
                    <Pagination v-model="page" :total="paginationPageLength" />
                </div>
            </div>

            <!-- data collection -->
            <div class="col-span-2 lg:col-span-1 flex-1 flex flex-col gap-4">
                <!-- restaurant informations -->
                <div class="w-full p-8 rounded-xl bg-white">
                    <div class="w-full flex flex-col gap-8">
                        <!-- card title -->
                        <Title>Allgemeine Informationen</Title>

                        <!-- tempalte seelector -->
                        <FormSelect
                            v-model="templateInformation.template"
                            :options="templates"
                            label="name"
                            select-label="Speisekarten Stil"
                        ></FormSelect>

                        <!-- page size selector -->
                        <FormSelect
                            v-model="templateInformation.pageSize"
                            :options="pageSizes"
                            label="size"
                            select-label="Papier größe"
                        ></FormSelect>

                        <!-- restaurant logo -->
                        <div class="grid grid-cols-10">
                            <div class="col-span-4">
                                <FormTitleError>
                                    <FormFileUpload
                                        v-model="
                                            templateInformation
                                                .restaurant_information.logo
                                        "
                                        label="Logo"
                                        :dimension="{ width: 100, height: 100 }"
                                    />
                                </FormTitleError>
                            </div>
                            <div class="col-span-6">
                                <FormInput
                                    label="Titel"
                                    v-model="
                                        templateInformation
                                            .restaurant_information.name
                                    "
                                    mode="blur"
                                />
                            </div>
                        </div>

                        <!-- description -->
                        <FormText
                            v-model="
                                templateInformation.restaurant_information
                                    .description
                            "
                            label="Beschreibung"
                            mode="blur"
                        />
                    </div>

                    <!-- Footer text -->
                    <div class="flex-between">
                        <div class="text-gray-color mt-4">
                            Schreibe ein paar Sätze um deinen Kunden die
                            Speisekarte vorzustellen
                        </div>
                    </div>
                </div>

                <!-- product list -->
                <div
                    id="food-and-drinks"
                    class="w-full p-8 rounded-xl bg-white"
                >
                    <div class="w-full flex flex-col gap-8">
                        <Title>Speisen und Getränke</Title>

                        <div class="w-full flex flex-col gap-4">
                            <div class="text=[#101010] font-bold">Produkte</div>
                            <!-- select product -->
                            <FormSelect
                                v-model="selectedProduct"
                                :options="products"
                                @option-selected="
                                    $emit('update:updating-product', null)
                                "
                                label="name"
                            >
                                <template #option="{ name, logo }">
                                    <div class="flex-start gap-4">
                                        <img
                                            v-if="logo"
                                            :src="logo"
                                            class="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full"
                                        />
                                        <div
                                            v-else
                                            class="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-gray-300"
                                        ></div>
                                        <div>{{ name }}</div>
                                    </div>
                                </template>

                                <template #selected-option="{ name, logo }">
                                    <div class="flex-start gap-4">
                                        <img
                                            v-if="logo"
                                            :src="logo"
                                            class="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full"
                                        />
                                        <div
                                            v-else
                                            class="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-gray-300"
                                        ></div>
                                        <div>{{ name }}</div>
                                    </div>
                                </template>
                            </FormSelect>

                            <!-- add product grid -->
                            <div class="grid grid-cols-12 gap-4">
                                <!-- inputs -->
                                <div
                                    class="col-span-12 md:col-span-6 lg:col-span-7 xl:col-span-9 flex flex-col gap-4"
                                >
                                    <div class="grid grid-cols-3 gap-4">
                                        <FormInput
                                            v-model="product.name"
                                            label="Name"
                                            class="col-span-2"
                                            :error="formErrors?.name"
                                        />
                                        <FormInput
                                            v-model="product.price"
                                            label="Preis"
                                            type="number"
                                            step="any"
                                            class="col-span-1"
                                            :error="formErrors?.price"
                                        />
                                    </div>

                                    <FormText
                                        v-model="product.description"
                                        label="Beschreibung"
                                        :rows="3"
                                        :error="formErrors?.description"
                                    />
                                </div>
                                <!-- logo -->
                                <div
                                    class="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-3 flex flex-col gap-4 items-center justify-between"
                                >
                                    <FormTitleError :error="formErrors?.logo">
                                        <FormFileUpload2
                                            v-model="product.logo"
                                            class="mt-6"
                                        />
                                    </FormTitleError>

                                    <Button
                                        :label="
                                            editMode
                                                ? 'Aktualisieren'
                                                : 'Hinzufügen'
                                        "
                                        @click="onProductAdd"
                                    >
                                        <template #icon>
                                            <svg
                                                v-if="editMode"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                            >
                                                <path
                                                    d="M13.4685 0.531669C12.7597 -0.17706 11.6106 -0.17706 10.9019 0.531669L10.1019 1.33167L12.6684 3.89821L13.4685 3.0982C14.1772 2.38948 14.1772 1.2404 13.4685 0.531669Z"
                                                    fill="#F4F4F4"
                                                />
                                                <path
                                                    d="M11.9352 4.6315L9.36862 2.06497L3.56063 7.87296C3.13421 8.29938 2.82075 8.82533 2.64859 9.40329L2.09566 11.2595C2.0413 11.442 2.09132 11.6395 2.22595 11.7742C2.36057 11.9088 2.55816 11.9588 2.74062 11.9045L4.59685 11.3515C5.1748 11.1794 5.70075 10.8659 6.12717 10.4395L11.9352 4.6315Z"
                                                    fill="#F4F4F4"
                                                />
                                                <path
                                                    d="M2.07407 2.59271C0.928595 2.59271 0 3.5213 0 4.66678V11.926C0 13.0715 0.928594 14.0001 2.07407 14.0001H9.33333C10.4788 14.0001 11.4074 13.0715 11.4074 11.926V8.29641C11.4074 8.01004 11.1753 7.77789 10.8889 7.77789C10.6025 7.77789 10.3704 8.01004 10.3704 8.29641V11.926C10.3704 12.4988 9.90607 12.9631 9.33333 12.9631H2.07407C1.50133 12.9631 1.03704 12.4988 1.03704 11.926V4.66678C1.03704 4.09404 1.50133 3.62975 2.07407 3.62975H5.7037C5.99007 3.62975 6.22222 3.3976 6.22222 3.11123C6.22222 2.82486 5.99007 2.59271 5.7037 2.59271H2.07407Z"
                                                    fill="#F4F4F4"
                                                />
                                            </svg>

                                            <svg
                                                v-else
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M7 14.0001C10.866 14.0001 14 10.8661 14 7.00012C14 3.13413 10.866 0.00012207 7 0.00012207C3.13401 0.00012207 0 3.13413 0 7.00012C0 10.8661 3.13401 14.0001 7 14.0001ZM7.65625 4.15637C7.65625 3.79394 7.36244 3.50012 7 3.50012C6.63756 3.50012 6.34375 3.79394 6.34375 4.15637V6.34387H4.15625C3.79381 6.34387 3.5 6.63769 3.5 7.00012C3.5 7.36256 3.79381 7.65637 4.15625 7.65637H6.34375V9.84387C6.34375 10.2063 6.63756 10.5001 7 10.5001C7.36244 10.5001 7.65625 10.2063 7.65625 9.84387V7.65637H9.84375C10.2062 7.65637 10.5 7.36256 10.5 7.00012C10.5 6.63769 10.2062 6.34387 9.84375 6.34387H7.65625V4.15637Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </template>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <!-- product list -->
                        <div class="flex flex-col gap-4">
                            <div class="text=[#101010] font-bold">
                                Hinzugefügt
                            </div>

                            <!-- drag and droppable product list -->
                            <SmoothDnd
                                :options="templateInformation.products"
                                drag-handle-selector=".drag-handle"
                                ghost-preview-background="#d1d1d1"
                                @drop="(products: Product[]) => onDrop(products)"
                            >
                                <template #option="{ option: product }">
                                    <div
                                        class="flex flex-row w-full border-b border-[#d9d9d9] gap-4 pb-4"
                                    >
                                        <!-- drag handler -->
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="19"
                                            height="12"
                                            viewBox="0 0 19 12"
                                            fill="none"
                                            class="drag-handle cursor-move my-auto"
                                        >
                                            <path
                                                d="M1 0.750122H17.5M1 6.00012H17.5M1 11.2501H17.5"
                                                stroke="#AFAFAF"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>

                                        <!-- logo -->
                                        <img
                                            v-if="product.logo"
                                            :src="product.logo"
                                            class="w-16 h-16 min-w-[64px] min-h-[64px] rounded-full my-auto"
                                        />
                                        <div
                                            v-else
                                            class="w-16 h-16 min-w-[64px] min-h-[64px] rounded-full bg-gray-300 my-auto"
                                        ></div>

                                        <!-- title description -->
                                        <div
                                            class="flex flex-col flex-1 gap-2 pr-4 my-auto"
                                        >
                                            <div class="flex-start gap-3">
                                                <div class="text-[#101010]">
                                                    {{ product.name }}
                                                </div>
                                                <a
                                                    v-if="product?.link"
                                                    :href="product.link"
                                                    target="_blank"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="15"
                                                        height="14"
                                                        viewBox="0 0 15 14"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M8.5 3.00012H3C2.17157 3.00012 1.5 3.6717 1.5 4.50012V11.5001C1.5 12.3285 2.17157 13.0001 3 13.0001H10C10.8284 13.0001 11.5 12.3285 11.5 11.5001V6.00012M4.5 10.0001L13.5 1.00012M13.5 1.00012L10 1.00012M13.5 1.00012V4.50012"
                                                            stroke="url(#paint0_linear_482_481)"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        />
                                                        <defs>
                                                            <linearGradient
                                                                id="paint0_linear_482_481"
                                                                x1="13.5"
                                                                y1="7.21436"
                                                                x2="1.5"
                                                                y2="7.21436"
                                                                gradientUnits="userSpaceOnUse"
                                                            >
                                                                <stop
                                                                    stop-color="#EF6344"
                                                                />
                                                                <stop
                                                                    offset="0.953125"
                                                                    stop-color="#D15258"
                                                                />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                </a>
                                            </div>

                                            <div
                                                class="text-gray-color font-light text-[13px]"
                                            >
                                                {{ product.description }}
                                            </div>
                                        </div>

                                        <!-- price and action buttons -->
                                        <div class="h-full flex flex-col">
                                            <div
                                                class="flex-end text-[#101010] font-bold mb-auto flex-1"
                                            >
                                                {{ `${product.price} €` }}
                                            </div>
                                            <div class="flex-start gap-3 mt-10">
                                                <!-- edit button -->
                                                <IconButton
                                                    @click="
                                                        updatingProduct =
                                                            product
                                                    "
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 14 14"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M13.4685 0.531669C12.7597 -0.17706 11.6106 -0.17706 10.9019 0.531669L10.1019 1.33167L12.6684 3.89821L13.4685 3.0982C14.1772 2.38948 14.1772 1.2404 13.4685 0.531669Z"
                                                            fill="#F4F4F4"
                                                        />
                                                        <path
                                                            d="M11.9352 4.6315L9.36862 2.06497L3.56063 7.87296C3.13421 8.29938 2.82075 8.82533 2.64859 9.40329L2.09566 11.2595C2.0413 11.442 2.09132 11.6395 2.22595 11.7742C2.36057 11.9088 2.55816 11.9588 2.74062 11.9045L4.59685 11.3515C5.1748 11.1794 5.70075 10.8659 6.12717 10.4395L11.9352 4.6315Z"
                                                            fill="#F4F4F4"
                                                        />
                                                        <path
                                                            d="M2.07407 2.59271C0.928595 2.59271 0 3.5213 0 4.66678V11.926C0 13.0715 0.928594 14.0001 2.07407 14.0001H9.33333C10.4788 14.0001 11.4074 13.0715 11.4074 11.926V8.29641C11.4074 8.01004 11.1753 7.77789 10.8889 7.77789C10.6025 7.77789 10.3704 8.01004 10.3704 8.29641V11.926C10.3704 12.4988 9.90607 12.9631 9.33333 12.9631H2.07407C1.50133 12.9631 1.03704 12.4988 1.03704 11.926V4.66678C1.03704 4.09404 1.50133 3.62975 2.07407 3.62975H5.7037C5.99007 3.62975 6.22222 3.3976 6.22222 3.11123C6.22222 2.82486 5.99007 2.59271 5.7037 2.59271H2.07407Z"
                                                            fill="#F4F4F4"
                                                        />
                                                    </svg>
                                                </IconButton>

                                                <!-- delete button -->
                                                <Button
                                                    label="Entfernen"
                                                    @click="onDelete(product)"
                                                >
                                                    <template #icon>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 14 14"
                                                            fill="none"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                clip-rule="evenodd"
                                                                d="M7 14.0001C10.866 14.0001 14 10.8661 14 7.00012C14 3.13413 10.866 0.00012207 7 0.00012207C3.13401 0.00012207 0 3.13413 0 7.00012C0 10.8661 3.13401 14.0001 7 14.0001ZM4.15625 6.34387C3.79381 6.34387 3.5 6.63769 3.5 7.00012C3.5 7.36256 3.79381 7.65637 4.15625 7.65637H9.84375C10.2062 7.65637 10.5 7.36256 10.5 7.00012C10.5 6.63769 10.2062 6.34387 9.84375 6.34387H4.15625Z"
                                                                fill="white"
                                                            />
                                                        </svg>
                                                    </template>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </SmoothDnd>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 
            We are using this component to generate the pagination pages and html string depeneding on the template content.
            We could use js native domParser or packages like jsDom to do this. But result wouldn't be consistent.
            Rendering inside the browser should be the best choide.
            So rendering this screen outside of the viewport to generater required data
         -->
        <PreviewBuilder
            :page-width="PAGEWIDTH"
            :page-height="PAGEHEIGHT"
            :page-margin="PAGEMARGIN"
            :template-information="templateInformation"
            :product-component="productComponent"
            :restaurant-component="restaurantComponent"
            :template-component="(templateComponent as DefineComponent)"
            @update:page="onUpdatePreviewPages"
            @update:template-string="onUpdateTempalteString"
        />
    </div>
</template>
