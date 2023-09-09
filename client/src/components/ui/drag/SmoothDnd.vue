<script setup lang="ts" generic="T">
import { ref, computed, useSlots } from 'vue';
// @ts-ignore
import { Container, Draggable } from 'vue3-smooth-dnd';

// types
type DragResult = {
    isSource: boolean;
    payload: T;
    willAcceptDrop: boolean;
};
type DropResult = {
    addedIndex: number;
    removedIndex: number;
    payload: T;
    element: HTMLElement;
};
type DropPlaceholder = {
    className: string;
    animationDuration: number;
    showOnTop: boolean;
};
type Props = {
    options: T[];
    optionKey?: string;
    orientation?: 'horizontal' | 'vertical';
    behaviour?: 'move' | 'copy' | 'drop-zone' | 'contain';
    tag?: string | { value: string; props?: Record<string, any> };
    groupName?: string;
    lockAxis?: 'x' | 'y';
    dragHandleSelector?: string;
    dragClass?: string;
    dropClass?: string;
    dropPlaceholder?: DropPlaceholder;
    draggableItemClass?: string;
    disabled?: boolean | ((option: T) => boolean);
    disableClass?: string;
    ghostBackground?: string;
    ghostPreviewBorder?: string;
    ghostPreviewBackground?: string;
    draggableMargin?: string;
    shouldAcceptDrop?: (
        containerOptions: Record<string, any>,
        payload: T
    ) => boolean;
    shouldAnimateDrop?: (
        containerOptions: Record<string, any>,
        payload: T
    ) => boolean;
};

type Emit = {
    (e: 'drop', options: T[], dropResult: DropResult): void;
    (e: 'drag-start', dragResult: DragResult): void;
    (e: 'drag-end', dragResult: DragResult): void;
    (e: 'drag-enter'): void;
    (e: 'drag-leave'): void;
    (e: 'drop-ready', dropResult: DropResult): void;
};

// props and emits
const emit = defineEmits<Emit>();
const props = withDefaults(defineProps<Props>(), {
    orientation: () => 'vertical',
    optionKey: () => 'id',
    behaviour: () => 'move',
    tag: () => 'div',
    disabled: () => false,
    disableClass: () => 'option-disabled',
    draggableMargin: () => '0 0 8px 0',
    ghostBackground: () => 'transparent',
    ghostPreviewBorder: () => '2px dashed #999',
    ghostPreviewBackground: () => '#ffffff',
    dropPlaceholder: () => ({
        className: 'drop-preview',
        animationDuration: 150,
        showOnTop: true,
    }),
});

const slots = useSlots();
const slotNames = computed(() => Object.keys(slots));

const items = computed<T[]>({
    get: () => props.options,
    set: value => value,
});

const onDrop = (dropResult: DropResult) => {
    const { removedIndex, addedIndex, payload } = dropResult;
    if (!payload || (removedIndex === null && addedIndex === null)) return;
    else if (removedIndex !== null && addedIndex !== null) {
        items.value.splice(removedIndex, 1);
        items.value.splice(addedIndex, 0, payload);
    } else if (addedIndex !== null) {
        items.value.splice(addedIndex, 0, payload);
    } else if (removedIndex !== null) {
        items.value.splice(removedIndex, 1);
    }
    emit('drop', items.value, dropResult);
};

const getChildPayload = (index: number): T => {
    return items.value[index];
};

const isDisabled = (item: T) => {
    if (!props.disabled) return false;
    else if (typeof props.disabled === 'boolean')
        return Boolean(props.disabled);
    else if (typeof props.disabled === 'function') return props.disabled(item);
    return false;
};

const dragging = ref(false);
const onDragStart = (event: DragResult) => {
    dragging.value = true;
    emit('drag-start', event);
};
const onDragEnd = (event: DragResult) => {
    dragging.value = false;
    emit('drag-end', event);
};

const getKey = (option: T, index: number) => {
    if (!props.optionKey) return index;

    if (typeof option === 'object' && null !== option && !Array.isArray(option))
        // @ts-ignore
        return option[props.optionKey];
    return index;
};
</script>

<template>
    <div class="h-100">
        <Container
            :tag="tag"
            :orientation="orientation"
            :behaviour="behaviour"
            :drag-handle-selector="dragHandleSelector"
            :group-name="groupName"
            :drop-placeholder="dropPlaceholder"
            :drag-class="dragClass ? dragClass : 'card-ghost'"
            :drop-class="dropClass ? dropClass : 'card-ghost-drop'"
            :get-child-payload="getChildPayload"
            :should-accept-drop="shouldAcceptDrop"
            :should-animate-drop="shouldAnimateDrop"
            :lock-axis="lockAxis"
            :non-drag-area-selector="`.${disableClass}`"
            @drop="(dropResult: DropResult) => onDrop(dropResult)"
            @drag-start="(dragResult: DragResult) =>  onDragStart(dragResult)"
            @drag-end="(dragResult: DragResult) =>  onDragEnd(dragResult)"
            @drag-enter="$emit('drag-enter')"
            @drag-leave="$emit('drag-leave')"
            @drop-ready="(dropResult: DropResult) => $emit('drop-ready', dropResult)"
            class="h-full"
        >
            <Draggable
                v-for="(item, index) in items"
                :key="getKey(item, index)"
                :class="[
                    draggableItemClass ? draggableItemClass : '',
                    isDisabled(item) ? disableClass : '',
                ]"
            >
                <slot name="option" :option="item" :index="index"></slot>
            </Draggable>

            <slot
                v-if="slotNames.includes('no-option') && !items?.length"
                name="no-option"
            ></slot>

            <slot
                v-if="slotNames.includes('container')"
                name="container"
            ></slot>

            <div v-if="slotNames.includes('footer')" :class="[disableClass]">
                <slot name="footer"></slot>
            </div>
        </Container>
    </div>
</template>

<style scoped>
:deep(.smooth-dnd-container .smooth-dnd-ghost) {
    opacity: 0.9;
    transition: transform 0.18s ease;
    transform: rotateZ(2deg);
    background: v-bind('ghostBackground');
}

:deep(.smooth-dnd-container .smooth-dnd-drop-preview-constant-class) {
    border: v-bind('ghostPreviewBorder');
    border-radius: 5px;
    width: 100%;
    background: v-bind('ghostPreviewBackground');
}

:deep(.smooth-dnd-container .smooth-dnd-draggable-wrapper) {
    margin: v-bind('draggableMargin');
}
</style>
