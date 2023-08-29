<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import useFile from '@/composables/files/useFile';

import { v4 } from 'uuid';
import { useToast } from 'vue-toastification';

type Props = {
    modelValue: File | string | null;
    toBase64: boolean;
};

type Emit = {
    (e: 'update:model-value', file: File | string | null): void;
};

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    toBase64: true,
});

const emit = defineEmits<Emit>();

const toast = useToast();
const { resizeAndConvertToBase64 } = useFile();

const id = ref(`file-input-${v4()}`);
const file = ref<File | null>(null);
const base64 = ref<string | null>(null);

watchEffect(() => {
    if (typeof props.modelValue === 'string') base64.value = props.modelValue;
    else base64.value = null;
});

const onFileUpload = async (event: Event) => {
    const el = event.target as HTMLInputElement;
    const uploadedFile = el.files?.length ? el.files[0] : null;

    if (!isValidImage(uploadedFile)) {
        toast.error('File is not image file');
        return;
    }

    if (uploadedFile) {
        file.value = uploadedFile;
        base64.value = await resizeAndConvertToBase64(file.value, {
            width: 120,
            height: 120,
        });
        emit('update:model-value', props.toBase64 ? base64.value : file.value);
    }
};

const isValidImage = (file: File | null): boolean => {
    if (!file) return true;
    return Boolean(file instanceof File && file.type.includes('image/'));
};
</script>
<template>
    <label
        :for="id"
        class="w-[100px] h-[100px] min-w-[100px] min-h[100px] rounded-full border border-gray-200 relative block bg-gray-300 cursor-pointer"
    >
        <img v-if="base64" :src="base64" class="w-full h-full rounded-full" />

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="30"
            viewBox="0 0 36 30"
            fill="none"
            class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10"
        >
            <path
                d="M18.1667 9.99994C14.715 9.99994 11.9167 12.7982 11.9167 16.2499C11.9167 19.7017 14.715 22.4999 18.1667 22.4999C21.6185 22.4999 24.4167 19.7017 24.4167 16.2499C24.4167 12.7982 21.6185 9.99994 18.1667 9.99994Z"
                fill="white"
                fill-opacity="0.75"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.7406 0.118483C15.2061 0.0397865 16.6818 -6.10352e-05 18.1667 -6.10352e-05C19.6517 -6.10352e-05 21.1274 0.0397865 22.5929 0.118483C24.2056 0.205082 25.6424 1.09347 26.4804 2.43634L27.8491 4.6297C28.2476 5.26826 28.9242 5.70213 29.6993 5.81228C30.3416 5.90356 30.9815 6.00236 31.6189 6.10857C34.0053 6.50624 35.6667 8.59636 35.6667 10.9567V24.9999C35.6667 27.7614 33.4282 29.9999 30.6667 29.9999H5.66675C2.90532 29.9999 0.666748 27.7614 0.666748 24.9999V10.9566C0.666748 8.59634 2.32818 6.50622 4.71461 6.10856C5.35201 6.00234 5.99191 5.90355 6.63421 5.81227C7.40935 5.70212 8.08595 5.26825 8.48442 4.62969L9.85311 2.43634C10.6911 1.09347 12.1279 0.205082 13.7406 0.118483ZM9.41675 16.2499C9.41675 11.4174 13.3343 7.49994 18.1667 7.49994C22.9992 7.49994 26.9167 11.4174 26.9167 16.2499C26.9167 21.0824 22.9992 24.9999 18.1667 24.9999C13.3343 24.9999 9.41675 21.0824 9.41675 16.2499ZM29.4167 13.7499C30.1071 13.7499 30.6667 13.1903 30.6667 12.4999C30.6667 11.8096 30.1071 11.2499 29.4167 11.2499C28.7264 11.2499 28.1667 11.8096 28.1667 12.4999C28.1667 13.1903 28.7264 13.7499 29.4167 13.7499Z"
                fill="white"
                fill-opacity="0.75"
            />
        </svg>
        <input
            :id="id"
            type="file"
            class="w-0 h-0 invisible"
            @change="onFileUpload"
        />
    </label>
</template>
