<script setup lang="ts">
// components
import {
    PixelPercent,
    ColorPicker,
    PropertySelect,
} from '@/components/pages/template-builder/style-components';
// types
import { TemplateBuilderItem } from '@/types/home/home';

type Props = {
    activeTemplate: TemplateBuilderItem;
    template: TemplateBuilderItem;
};

type Emit = {
    (
        e: 'update-builder-item',
        template: TemplateBuilderItem,
        activeTemplate: TemplateBuilderItem
    ): void;
};

// props and emits
const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const onStyleUpdate = (key: string, value: string | number) => {
    const updatedActiveTemplate: TemplateBuilderItem = {
        ...props.activeTemplate,
        style: Object.entries(props.activeTemplate.style).reduce(
            (r, [styleKey, styleVal]) => {
                if (styleKey === key) return { ...r, [styleKey]: value };
                return { ...r, [styleKey]: styleVal };
            },
            {}
        ),
    };

    const updateTemplateItem = (
        templateItem: TemplateBuilderItem
    ): TemplateBuilderItem => {
        if (templateItem.id === updatedActiveTemplate.id)
            return updatedActiveTemplate;
        return {
            ...templateItem,
            children: templateItem.children.map(child =>
                updateTemplateItem(child)
            ),
        };
    };

    const updatedTemplate: TemplateBuilderItem = updateTemplateItem(
        props.template
    );
    emit('update-builder-item', updatedTemplate, updatedActiveTemplate);
};

const percentPixelProps = ['width', 'height', 'borderRadius'];
const pixelProps = [
    'fontSize',
    'lineHeight',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
    'gap',
];
const colorProps = ['color', 'background'];
const dropdownProps = [
    { key: 'flexDirection', options: ['row', 'column'] },
    {
        key: 'justifyContent',
        options: [
            'flex-start',
            'center',
            'flex-end',
            'space-between',
            'space-around',
        ],
    },
    {
        key: 'alignItems',
        options: [
            'flex-start',
            'center',
            'flex-end',
            'space-between',
            'space-around',
        ],
    },
    {
        key: 'fontWeight',
        options: ['300', '400', '500', '600', '700', '800', '900'],
    },
    { key: 'textAlign', options: ['left', 'center', 'right'] },
    {
        key: 'textDecoration',
        options: ['none', 'underline', 'overline', 'line-through'],
    },
    { key: 'fontStyle', options: ['normal', 'italic', 'oblique'] },
];

const dropdownPropsKeys = dropdownProps.map(d => d.key);
</script>

<template>
    <div class="w-full">
        <!-- title -->
        <div class="w-full mb-6">
            <div class="text-theme font-bold">Element styles</div>
            <div class="mt-1 text-theme font-light text-sm">
                {{ activeTemplate?.title ? activeTemplate.title : '' }}
            </div>
            <div class="mt-1 text-xs font-light">
                Style the elements according to your theme...
            </div>
        </div>

        <div>
            <template
                v-for="[key, value] in Object.entries(activeTemplate.style)"
                :key="key"
            >
                <PixelPercent
                    v-if="percentPixelProps.concat(pixelProps).includes(key)"
                    :prop-name="key"
                    :prop-value="value"
                    :pixel-only="pixelProps.includes(key)"
                    @update="(key, value) => onStyleUpdate(key, value)"
                />

                <ColorPicker
                    v-if="colorProps.includes(key)"
                    :prop-name="key"
                    :prop-value="value"
                    @update="(key, value) => onStyleUpdate(key, value)"
                />

                <!-- <template
                    v-for="dropdownSelect in dropdownProps"
                    :key="dropdownSelect.key"
                > -->
                <PropertySelect
                    v-if="dropdownPropsKeys.includes(key)"
                    :prop-name="key"
                    :prop-value="value"
                    :options="
                        dropdownProps.find(d => d.key === key)?.options || []
                    "
                    @update="(key, value) => onStyleUpdate(key, value)"
                />
                <!-- </template> -->
            </template>
        </div>
    </div>
</template>
