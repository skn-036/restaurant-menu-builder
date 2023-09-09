<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue';

// components
import { FormInput, FormFileUpload } from '@/components/ui/form';

// 3rd party
import { cloneDeep } from 'lodash';

// types
import { Template } from '@/types/home/home';
import { UiTab } from '@/types/ui/ui';

type Tab = UiTab & {
    tab: 'template_information' | 'restaurant_information' | 'product';
};

type Props = {
    tab: Tab;
    templateData: Template;
};

type Emit = {
    (e: 'update:template-data', template: Template): void;
    (
        e: 'go-to-tab',
        tab: 'template_information' | 'restaurant_information' | 'product'
    ): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const formData = ref<Template>({ ...props.templateData });
watchEffect(() => {
    formData.value = { ...props.templateData };
});

watch(
    () => cloneDeep(formData.value),
    () => {
        emit('update:template-data', formData.value);
    }
);

// const onSubmit = () => {
//     if (!canSubmit.value) return;

//     emit('update:template-data', formData.value);
//     if (formData.value.name) emit('go-to-tab', 'restaurant_information');
// };

// const canSubmit = computed(() =>
//     Boolean(formData.value.name || props.templateData.name)
// );
</script>

<template>
    <div class="w-full py-4 rounded-md h-full">
        <div class="w-[793px] max-w-full mx-auto">
            <FormInput
                v-model="formData.name"
                class="w-full"
                label="Template name:"
            />

            <FormFileUpload
                v-model="formData.background"
                label="Template background:"
                :preview="false"
                :dimension="{ width: 793, height: 1120 }"
                class="mt-4"
            />

            <div
                class="background-container w-full aspect-[298/421] rounded-sm mt-6"
            >
                <img
                    v-if="formData.background"
                    :src="formData.background"
                    class="w-full h-full rounded-sm"
                />
                <div v-else class="w-full h-full bg-white"></div>
            </div>
        </div>
    </div>
</template>
