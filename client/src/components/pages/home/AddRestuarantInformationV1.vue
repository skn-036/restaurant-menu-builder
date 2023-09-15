<script setup lang="ts">
import { inject, ref, watchEffect } from 'vue';

import { Title } from '@/components/ui/components';
import {
    FormInput,
    FormSelect,
    FormFileUpload,
    FormText,
    FormTitleError,
} from '@/components/ui/form';
import { Button } from '@/components/ui/buttons';

import useTemplate from '@/composables/template/useTemplate';
import useValidation from '@/composables/validation/useValidation';

import { string as yupString, object as yupObject } from 'yup';

import {
    templateInformationProviderKey,
    templateProviderKey,
} from '@/symbols/home/home';
import {
    TemplateInformationProvider,
    TemplateProvider,
} from '@/types/providers/home';
import { TemplateInformation } from '@/types/home/home';
import { YupValidationError } from '@/types/validation/validation.ts';

const { pageSizes } = useTemplate();
const { runYupValidation } = useValidation();

const { templateInformation, onUpdateTemplateInformation } = inject(
    templateInformationProviderKey
) as TemplateInformationProvider;

const { templates } = inject(templateProviderKey) as TemplateProvider;

const formData = ref<Pick<TemplateInformation, 'restaurant_information'>>({
    restaurant_information: {
        ...templateInformation.value.restaurant_information,
    },
});
const formErrors = ref<YupValidationError>({});
watchEffect(() => {
    formData.value = {
        restaurant_information: {
            ...templateInformation.value.restaurant_information,
        },
    };
});

const schema = yupObject().shape({
    restaurant_information: yupObject().shape({
        name: yupString().nullable().required('Name ist erforderlich'),
        description: yupString()
            .nullable()
            .required('Beschreibung ist erforderlich'),
        logo: yupString().nullable().required('Logo ist erforderlich'),
    }),
});

const onSubmit = async () => {
    const { validated, errors } = await runYupValidation(
        schema,
        formData.value
    );

    if (!validated) {
        formErrors.value = errors ? errors : {};
        return;
    }
    formErrors.value = {};

    const newTemplateInformation = {
        ...templateInformation.value,
        ...formData.value,
    };
    onUpdateTemplateInformation(newTemplateInformation);
};
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
                :error="
                    formErrors && formErrors['template.id']
                        ? formErrors['template.id']
                        : null
                "
            ></FormSelect>

            <FormSelect
                v-model="templateInformation.pageSize"
                :options="pageSizes"
                label="size"
                select-label="Papier größe"
                :error="
                    formErrors && formErrors['pageSize.size']
                        ? formErrors['pageSize.size']
                        : null
                "
            ></FormSelect>

            <div class="grid grid-cols-10">
                <div class="col-span-4">
                    <FormTitleError
                        :error="
                            formErrors &&
                            formErrors['restaurant_information.logo']
                                ? formErrors['restaurant_information.logo']
                                : null
                        "
                    >
                        <FormFileUpload
                            v-model="formData.restaurant_information.logo"
                            label="Logo"
                            :dimension="{ width: 100, height: 100 }"
                        />
                    </FormTitleError>
                </div>
                <div class="col-span-6">
                    <FormInput
                        label="Titel"
                        v-model="formData.restaurant_information.name"
                        :error="
                            formErrors &&
                            formErrors['restaurant_information.name']
                                ? formErrors['restaurant_information.name']
                                : null
                        "
                    />
                </div>
            </div>

            <FormText
                v-model="formData.restaurant_information.description"
                label="Beschreibung"
                :error="
                    formErrors &&
                    formErrors['restaurant_information.description']
                        ? formErrors['restaurant_information.description']
                        : null
                "
            />
        </div>

        <div class="flex-between">
            <div class="text-gray-color mt-4">
                Schreibe ein paar Sätze um deinen Kunden die Speisekarte
                vorzustellen
            </div>

            <div class="ml-4 lg:ml-8">
                <Button label="Hinzufügen" @click="onSubmit">
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
