<template>
    <div class="ml-40">
        <div
            class="w-[596px] h-[842px] bg-[#5E4D47] relative overflow-hidden mt-8"
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
        </div>

        <button @click="a" class="mt-12">Null</button>
    </div>
</template>

<script setup lang="ts">
import { v4 } from 'uuid';
const a = () => {
    console.log(v4());
};
</script>
