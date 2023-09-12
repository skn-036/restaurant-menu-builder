<script setup lang="ts">
// components
import { FormInput, FormFileUpload } from '@/components/ui/form';

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

defineProps<Props>();
</script>

<template>
    <div class="w-full py-4 rounded-md h-full">
        <div class="w-[793px] max-w-full mx-auto">
            <FormInput
                v-model="templateData.name"
                class="w-full"
                label="Template name:"
            />

            <FormFileUpload
                v-model="templateData.background"
                label="Template background:"
                :preview="false"
                :dimension="{ width: 793, height: 1120 }"
                class="mt-4"
            />

            <div
                class="background-container w-full aspect-[298/421] rounded-sm mt-6"
            >
                <img
                    v-if="templateData.background"
                    :src="templateData.background"
                    class="w-full h-full rounded-sm"
                />
                <div v-else class="w-full h-full bg-white"></div>
            </div>
        </div>
    </div>
</template>
