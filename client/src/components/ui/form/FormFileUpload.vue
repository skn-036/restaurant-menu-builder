<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import FormLabel from '@/components/ui/form/FormLabel.vue';

import useFile from '@/composables/files/useFile';

import { v4 } from 'uuid';
import { useToast } from 'vue-toastification';

type Props = {
    modelValue: File | string | null;
    toBase64?: boolean;
    label?: string;
    uploadButtonText?: string;
    dimension?: { width: number; height: number };
    preview?: boolean;
};

type Emit = {
    (e: 'update:model-value', file: File | string | null): void;
};

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    toBase64: true,
    uploadButtonText: 'Ändern',
    preview: true,
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
        base64.value = await resizeAndConvertToBase64(
            file.value,
            props.dimension
        );

        emit('update:model-value', props.toBase64 ? base64.value : file.value);
    }
};

const isValidImage = (file: File | null): boolean => {
    if (!file) return true;
    return Boolean(file instanceof File && file.type.includes('image/'));
};
</script>
<template>
    <div>
        <FormLabel v-if="label">{{ label }}</FormLabel>
        <div class="flex-start gap-4">
            <template v-if="preview">
                <img
                    v-if="base64"
                    :src="base64"
                    class="w-10 h-100 min-w-[40px] min-h-[40px] rounded-full"
                />
                <span
                    v-else
                    class="w-10 h-100 min-w-[40px] min-h-[40px] rounded-full bg-gray-300 border border-gray-200"
                ></span>
            </template>

            <label
                :for="id"
                class="mb-0 px-2.5 py-1.5 rounded-md shadow-file-upload bg-white cursor-pointer"
                >{{ uploadButtonText }}</label
            >
            <input
                :id="id"
                type="file"
                class="w-0 h-0 invisible"
                @change="onFileUpload"
            />
        </div>
    </div>
</template>
