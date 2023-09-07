<script setup lang="ts">
import { ref } from 'vue';
// components
import Dnd from '@/components/ui/drag/Dnd.vue';
import ComponentTree from '@/components/pages/template-builder/ComponentTree.vue';

// composables
import useModal from '@/composables/toast/useModal';

// types
import { TemplateBuilderItem } from '@/types/home/home';
import { template } from 'lodash';

type Props = {
    templateItem: TemplateBuilderItem;
    activeTemplateItem: TemplateBuilderItem;
    isChildren: boolean;
};

type Emit = {
    (e: 'update-active-template', template: TemplateBuilderItem): void;
    (e: 'delete-item', template: TemplateBuilderItem): void;
};

// props and emits
const props = defineProps<Props>();
const emit = defineEmits<Emit>();

// composable extraction
const { showConfirmModal } = useModal();

const showChildItems = ref(true);
const onChildItemsToggle = () => {
    if (!props.templateItem.children.length) return;
    showChildItems.value = !showChildItems.value;
};

// delete
const onDelete = (templateItem: TemplateBuilderItem) => {
    if (!props.isChildren) return;

    showConfirmModal(null, confirmed => {
        if (confirmed) emit('delete-item', templateItem);
    });
};
</script>

<template>
    <div class="w-full">
        <div
            class="w-full flex-between p-2 rounded-md"
            :class="
                templateItem.id === activeTemplateItem.id
                    ? 'bg-gradient text-white'
                    : ''
            "
        >
            <div class="flex-start">
                <Icon
                    type="chevron-down"
                    size="16"
                    stroke-width="3px"
                    class="cursor-pointer mr-2 transition-transform duration-300"
                    :class="[
                        !showChildItems || !templateItem.children.length
                            ? '-rotate-90'
                            : '',
                        templateItem.children.length
                            ? ''
                            : templateItem.id === activeTemplateItem.id
                            ? 'text-[#D15258]'
                            : 'text-[#f3f4f6]',
                    ]"
                    @click.native.stop="onChildItemsToggle"
                />
                <div
                    class="cursor-pointer"
                    @click="$emit('update-active-template', templateItem)"
                >
                    {{ templateItem.title }}
                </div>
            </div>

            <div v-if="isChildren" class="flex-start">
                <Icon
                    type="trash-2"
                    size="16"
                    class="cursor-pointer mr-2"
                    @click="onDelete(templateItem)"
                />

                <Icon type="move" size="16" class="cursor-pointer drag-el" />
            </div>
        </div>

        <!-- v-if="templateItem.children.length && showChildItems" -->
        <div class="py-1 pl-6">
            <!-- :group="templateItem.id" -->
            <Dnd
                v-model="(templateItem.children as TemplateBuilderItem[])"
                group="component-drag"
                handle=".drag-el"
                remove-payload
            >
                <template #item="{ item, cssClass }">
                    <ComponentTree
                        v-if="showChildItems"
                        :template-item="item"
                        :active-template-item="activeTemplateItem"
                        is-children
                        :class="[cssClass]"
                        @update-active-template="
                            updateItem =>
                                $emit('update-active-template', updateItem)
                        "
                        @delete-item="
                            builderItem => $emit('delete-item', builderItem)
                        "
                    />
                </template>

                <template #no-items>
                    <div
                        v-if="templateItem.componentType === 'container'"
                        class="w-full h-2"
                    ></div>
                </template>
            </Dnd>
        </div>
    </div>
</template>
