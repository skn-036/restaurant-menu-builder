<script setup lang="ts">
import { RestaurantInformation } from '@/types/home/home';

type Props = {
    restaurantInformation: RestaurantInformation;
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
            gap: '24px',
            marginBottom: '48px',
        }"
    >
        <div
            :style="{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '16px',
            }"
        >
            <div
                :style="{
                    fontSize: '30px',
                    lineHeight: '38px',
                    fontWeight: '700',
                    color: '#ffffff',
                    textAlign: 'left',
                    marginRight: '24px',
                }"
            >
                {{ restaurantInformation.name }}
            </div>
            <img
                v-if="restaurantInformation.logo"
                :style="{
                    width: '75px',
                    height: '75px',
                    borderRadius: '999px',
                }"
                :src="restaurantInformation.logo"
            />
        </div>

        <div
            :style="{
                width: '100%',
                overflowWrap: 'break-word',
            }"
        >
            <div
                :style="{
                    fontSize: '20px',
                    lineHeight: '28px',
                    color: '#ffffff',
                    textAlign: 'right',
                    overflowWrap: 'break-word',
                }"
            >
                {{ restaurantInformation.description }}
            </div>
        </div>
    </div>
</template>
