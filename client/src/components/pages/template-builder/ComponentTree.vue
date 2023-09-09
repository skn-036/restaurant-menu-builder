<script setup lang="ts">
import { ref } from 'vue';
// components
// import Dnd from '@/components/ui/drag/Dnd.vue';
import { SmoothDnd } from '@/components/ui/drag';
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
    <div class="w-full h-max">
        <div
            class="w-full flex-between p-2 rounded-md"
            :class="
                templateItem.id === activeTemplateItem.id
                    ? 'bg-gradient text-white'
                    : ''
            "
        >
            <div class="flex-start">
                <!-- templateItem.children.length
                            ? ''
                            : templateItem.id === activeTemplateItem.id
                            ? 'text-[#D15258]'
                            : 'text-[#f3f4f6]', -->
                <Icon
                    v-if="templateItem.children.length"
                    type="chevron-down"
                    size="16"
                    stroke-width="3px"
                    class="cursor-pointer mr-2 transition-transform duration-300"
                    :class="[
                        !showChildItems || !templateItem.children.length
                            ? '-rotate-90'
                            : '',
                    ]"
                    @click.native.stop="onChildItemsToggle"
                />
                <div
                    class="cursor-pointer"
                    @click="$emit('update-active-template', templateItem)"
                >
                    {{ templateItem.title }}
                    <!-- {{ templateItem.componentType }} -->
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

        <div
            v-if="templateItem.children.length && showChildItems"
            class="py-1 pl-6"
        >
            <SmoothDnd
                :options="templateItem.children"
                group-name="component-drag"
                drag-handle-selector=".drag-el"
            >
                <template #option="{ option }">
                    <ComponentTree
                        :template-item="option"
                        :active-template-item="activeTemplateItem"
                        is-children
                        @update-active-template="
                            updateItem =>
                                $emit('update-active-template', updateItem)
                        "
                        @delete-item="
                            builderItem => $emit('delete-item', builderItem)
                        "
                    />
                </template>
            </SmoothDnd>
        </div>
    </div>
</template>
