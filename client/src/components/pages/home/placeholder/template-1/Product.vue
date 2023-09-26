<script setup lang="ts">
import { Product } from '@/types/home/home';

type Props = {
    product: Product;
};

defineProps<Props>();
</script>

<template>
    <div
        class="wrapper-div"
        :style="{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '16px',
            marginBottom: '32px',
        }"
    >
        <div
            :style="{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '32px',
            }"
        >
            <img
                v-if="product.logo"
                :src="product.logo"
                :style="{
                    width: '100px',
                    height: '100px',
                    borderRadius: '27px',
                }"
            />

            <div
                :style="{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '16px',
                }"
            >
                <div
                    :style="{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }"
                >
                    <div
                        :style="{
                            fontSize: '20px',
                            lineHeight: '28px',
                            fontWeight: '700',
                            color: '#ffffff',
                            textAlign: 'left',
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word',
                            marginBottom: '8px',
                        }"
                    >
                        {{ product.name }}
                    </div>
                    <div
                        :style="{
                            fontSize: '16px',
                            lineHeight: '20px',
                            fontWeight: '400',
                            color: 'rgb(244, 244, 244)',
                            textAlign: 'left',
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word',
                        }"
                    >
                        {{ product.description }}
                    </div>
                </div>

                <div
                    :style="{
                        fontSize: '20px',
                        lineHeight: '28px',
                        fontWeight: '500',
                        color: 'rgb(255, 255, 255)',
                        textAlign: 'left',
                        paddingLeft: '16px',
                        whiteSpace: 'normal',
                        overflowWrap: 'break-word',
                    }"
                >
                    {{ product.price }}€
                </div>
            </div>
        </div>
    </div>
</template>
