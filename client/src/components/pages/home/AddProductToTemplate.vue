<script setup lang="ts">
import { inject, ref, computed, watch } from 'vue';

import {
    FormInput,
    FormSelect,
    FormFileUpload2,
    FormText,
    FormTitleError,
} from '@/components/ui/form';
import { Button } from '@/components/ui/buttons';

import useValidation from '@/composables/validation/useValidation';

import { v4 } from 'uuid';
import { object as yupObject, string as yupString } from 'yup';

import { Product } from '@/types/home/home';
import {
    templateInformationProviderKey,
    productProviderKey,
} from '@/symbols/home/home';
import {
    TemplateInformationProvider,
    ProductProvider,
} from '@/types/providers/home';
import { YupValidationError } from '@/types/validation/validation.ts';

type Props = {
    updatingProduct?: Product | null;
};
type Emit = {
    (e: 'update:updating-product', value: Product | null): void;
};

const props = withDefaults(defineProps<Props>(), {
    updatingProduct: null,
});
const emit = defineEmits<Emit>();

const { templateInformation, onUpdateTemplateInformation } = inject(
    templateInformationProviderKey
) as TemplateInformationProvider;

const { products } = inject(productProviderKey) as ProductProvider;

const { runYupValidation } = useValidation();

const editMode = computed(() => Boolean(props.updatingProduct?.id));
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
            product.value = { ...selectedProduct.value };
        } else {
            product.value = { ...initialProduct.value, id: v4() };
        }
    }
);
watch(
    () => props.updatingProduct,
    () => {
        if (props.updatingProduct?.id)
            product.value = { ...props.updatingProduct };
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
            products: [product.value].concat(
                templateInformation.value.products
            ),
        };
        onUpdateTemplateInformation(newTemplateInformation);
        product.value = { ...initialProduct.value, id: v4() };
        selectedProduct.value = null;
    } else {
        const updatedProducts = templateInformation.value.products.map(
            templateProduct =>
                templateProduct?.id === props.updatingProduct?.id
                    ? product.value
                    : templateProduct
        );
        const newTemplateInformation = {
            ...templateInformation.value,
            products: updatedProducts,
        };
        onUpdateTemplateInformation(newTemplateInformation);
        emit('update:updating-product', null);
        product.value = { ...initialProduct.value, id: v4() };
        selectedProduct.value = null;
    }
};
</script>

<template>
    <div class="w-full flex flex-col gap-4">
        <div class="text=[#101010] font-bold">Produkte</div>
        <!-- select product -->
        <FormSelect
            v-model="selectedProduct"
            :options="products"
            @option-selected="$emit('update:updating-product', null)"
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
                    <FormFileUpload2 v-model="product.logo" class="mt-6" />
                </FormTitleError>

                <Button
                    :label="editMode ? 'Aktualisieren' : 'Hinzufügen'"
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
</template>
