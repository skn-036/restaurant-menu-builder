<script setup lang="ts">
import { inject } from 'vue';

import { Title } from '@/components/ui/components';
import {
    FormInput,
    FormSelect,
    FormFileUpload,
    FormText,
    FormTitleError,
} from '@/components/ui/form';

import useTemplate from '@/composables/template/useTemplate';

import {
    templateInformationProviderKey,
    templateProviderKey,
} from '@/symbols/home/home';
import {
    TemplateInformationProvider,
    TemplateProvider,
} from '@/types/providers/home';

const { pageSizes } = useTemplate();

const { templateInformation } = inject(
    templateInformationProviderKey
) as TemplateInformationProvider;

const { templates } = inject(templateProviderKey) as TemplateProvider;
</script>

<template>
    <div class="w-full p-8 rounded-xl bg-white">
        <div class="w-full flex flex-col gap-8">
            <Title>Allgemeine Informationen</Title>

            <FormSelect
                v-model="templateInformation.template"
                :options="templates"
                label="name"
                select-label="Speisekarten Stil"
            ></FormSelect>

            <FormSelect
                v-model="templateInformation.pageSize"
                :options="pageSizes"
                label="size"
                select-label="Papier größe"
            ></FormSelect>

            <div class="grid grid-cols-10">
                <div class="col-span-4">
                    <FormTitleError>
                        <FormFileUpload
                            v-model="
                                templateInformation.restaurant_information.logo
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
                            templateInformation.restaurant_information.name
                        "
                    />
                </div>
            </div>

            <FormText
                v-model="templateInformation.restaurant_information.description"
                label="Beschreibung"
            />
        </div>

        <div class="flex-between">
            <div class="text-gray-color mt-4">
                Schreibe ein paar Sätze um deinen Kunden die Speisekarte
                vorzustellen
            </div>
        </div>
    </div>
</template>
