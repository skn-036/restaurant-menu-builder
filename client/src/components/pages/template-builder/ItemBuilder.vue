<script setup lang="ts">
// components
import Button from '@/components/ui/buttons/Button.vue';
import ComponentTree from '@/components/pages/template-builder/ComponentTree.vue';

// composables
import useCreateTemplate from '@/composables/template/useCreateTemplate';
import useCommonUtils from '@/composables/utils/useCommonUtils';

// 3rd party packages
import { useToast } from 'vue-toastification';

// types
import { TemplateBuilderItem } from '@/types/home/home';

type Props = {
    builderItems: TemplateBuilderItem[];
    template: TemplateBuilderItem;
    activeTemplate: TemplateBuilderItem;
    title: string;
};

type Emit = {
    (
        e: 'update-builder-item',
        template: TemplateBuilderItem,
        activeTemplate: TemplateBuilderItem
    ): void;
    (e: 'update-active-template', template: TemplateBuilderItem): void;
};

// props & emit
const props = defineProps<Props>();
const emit = defineEmits<Emit>();

// composables extraction
const {} = useCreateTemplate('restaurant');
const { generateId } = useCommonUtils();
const toast = useToast();

/**
 * ----------------------------------------------------------------------------------------
 * Builder item disable status
 * ----------------------------------------------------------------------------------------
 */
const isBuilderItemDisabled = (builderItem: TemplateBuilderItem): boolean => {
    const identifier = builderItem.id.split('-')[0];
    if (['wrapper', 'restaurant', 'product'].includes(identifier)) return false;

    return checkIfItemExists(props.template, identifier);
};
const checkIfItemExists = (
    itemInTemplate: TemplateBuilderItem,
    identifier: string
): boolean => {
    const itemIdentifier = itemInTemplate.id.split('-')[0];

    if (itemIdentifier === identifier) return true;
    if (!itemInTemplate.children.length) return false;

    return itemInTemplate.children.some(child =>
        checkIfItemExists(child, identifier)
    );
};

/**
 * ----------------------------------------------------------------------------------------
 * add new item
 * ----------------------------------------------------------------------------------------
 */
const onBuilderItemAdd = (builderItem: TemplateBuilderItem) => {
    if (!props.activeTemplate.canAddChild) {
        toast.info(
            `Can't add child to ${props.activeTemplate.title}. Select wrapper elements instead...`
        );
        return;
    }

    const itemToBeAdded: TemplateBuilderItem = {
        ...builderItem,
        id: generateId(`${builderItem.id.split('-')[0]}-`),
    };
    console.log(itemToBeAdded);

    const addItemToActiveItem = (itemInTemplate: TemplateBuilderItem) => {
        if (itemInTemplate.id === props.activeTemplate.id) {
            itemInTemplate = {
                ...itemInTemplate,
                children: itemInTemplate.children.concat([itemToBeAdded]),
            };
        } else if (itemInTemplate.children.length) {
            itemInTemplate = {
                ...itemInTemplate,
                children: itemInTemplate.children.map(child =>
                    addItemToActiveItem(child)
                ),
            };
        }

        return itemInTemplate;
    };

    const template = addItemToActiveItem(props.template);
    const activeTemplate = { ...itemToBeAdded };

    emit('update-builder-item', template, activeTemplate);
};

const onBuilderItemDelete = (builderItem: TemplateBuilderItem) => {
    const deleteItem = (
        itemInTemplate: TemplateBuilderItem
    ): TemplateBuilderItem => {
        if (!itemInTemplate.children.length) return itemInTemplate;

        const itemToBeDeleted = itemInTemplate.children.find(
            children => children.id === builderItem.id
        );
        if (itemToBeDeleted?.id) {
            itemInTemplate = {
                ...itemInTemplate,
                children: itemInTemplate.children.filter(
                    children => children.id !== itemToBeDeleted.id
                ),
            };
            return itemInTemplate;
        } else {
            itemInTemplate = {
                ...itemInTemplate,
                children: itemInTemplate.children.map(children =>
                    deleteItem(children)
                ),
            };
        }

        return itemInTemplate;
    };

    const isActiveItemExists = (
        itemInTemplate: TemplateBuilderItem
    ): boolean => {
        if (props.activeTemplate.id === itemInTemplate.id) return true;
        if (!itemInTemplate.children.length) return false;

        return itemInTemplate.children.some(children =>
            isActiveItemExists(children)
        );
    };

    const template = deleteItem(props.template);
    const exists = isActiveItemExists(template);
    emit(
        'update-builder-item',
        template,
        exists ? props.activeTemplate : template
    );
};
</script>

<template>
    <div class="">
        <!-- title -->
        <div class="w-full mb-6">
            <div class="text-theme font-bold">{{ title }}</div>
            <div class="mt-1 text-xs font-light">
                Wrapping components with wrapper elements give more
                flexibility...
            </div>
        </div>
        <!-- builder items -->
        <div class="w-full">
            <div class="mb-3 font-bold text-[#121212] underline">
                Components:
            </div>
            <div
                v-for="builderItem in builderItems"
                :key="builderItem.id"
                class="flex-between mb-3"
            >
                <div class="font-medium">
                    {{
                        builderItem?.title
                            ? builderItem.title
                            : builderItem.componentType
                    }}
                </div>
                <Button
                    :disabled="isBuilderItemDisabled(builderItem)"
                    class="!py-3"
                    :on-disabled-button-click="
                        () =>
                            toast.info(
                                `${builderItem.title} is already added...`
                            )
                    "
                    @click="onBuilderItemAdd(builderItem)"
                >
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

        <!-- builder tree -->
        <div class="w-full mt-8">
            <div class="mb-3 font-bold text-[#121212] underline">
                Component tree:
            </div>

            <div class="w-full">
                <ComponentTree
                    :template-item="template"
                    :active-template-item="activeTemplate"
                    :is-children="false"
                    @update-active-template="
                        updatedActiveTemplate =>
                            $emit(
                                'update-active-template',
                                updatedActiveTemplate
                            )
                    "
                    @delete-item="
                        builderItem => onBuilderItemDelete(builderItem)
                    "
                />
            </div>
        </div>
    </div>
</template>
