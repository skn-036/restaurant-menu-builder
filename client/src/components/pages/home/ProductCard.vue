<script setup lang="ts">
import { inject } from 'vue';

import { Button, IconButton } from '@/components/ui/buttons';

import { Product } from '@/types/home/home';
import { templateInformationProviderKey } from '@/symbols/home/home';
import { TemplateInformationProvider } from '@/types/providers/home';
type Props = {
    product: Product;
};
type Emit = {
    (e: 'update:product', product: Product): void;
};

defineEmits<Emit>();
const props = defineProps<Props>();

const { templateInformation, onUpdateTemplateInformation } = inject(
    templateInformationProviderKey
) as TemplateInformationProvider;

const onDelete = () => {
    const updatedTemplateInformation = {
        ...templateInformation.value,
        products: templateInformation.value.products.filter(
            templateProduct => templateProduct?.id !== props.product?.id
        ),
    };
    onUpdateTemplateInformation(updatedTemplateInformation);
};
</script>

<template>
    <div class="flex flex-row w-full border-b border-[#d9d9d9] gap-4 pb-4">
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
        <div class="flex flex-col flex-1 gap-2 pr-4 my-auto">
            <div class="flex-start gap-3">
                <div class="text-[#101010]">{{ product.name }}</div>
                <a v-if="product?.link" :href="product.link" target="_blank">
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
                                <stop stop-color="#EF6344" />
                                <stop offset="0.953125" stop-color="#D15258" />
                            </linearGradient>
                        </defs>
                    </svg>
                </a>
            </div>

            <div class="text-gray-color font-light text-[13px]">
                {{ product.description }}
            </div>
        </div>

        <!-- price and action buttons -->
        <div class="h-full flex flex-col">
            <div class="flex-end text-[#101010] font-bold mb-auto flex-1">
                {{ `${product.price} €` }}
            </div>
            <div class="flex-start gap-3 mt-10">
                <!-- edit button -->
                <IconButton @click="$emit('update:product', product)">
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
                <Button label="Entfernen" @click="onDelete">
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
