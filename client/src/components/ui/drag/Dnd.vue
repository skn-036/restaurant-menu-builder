<script setup lang="ts" generic="T">
import { computed, watch, ref, onMounted, onUnmounted } from 'vue';

// @ts-ignore
import SortableInstance from 'sortablejs/modular/sortable.complete.esm.js';
import Sortable, {
    Options,
    SortableEvent,
    MoveEvent,
    GroupOptions,
} from 'sortablejs';

import useVueContext from '@/composables/vue/useVueContext';
import useCommonUtils from '@/composables/utils/useCommonUtils';

import { cloneDeep } from 'lodash';

type Props = {
    items?: T[];
    modelValue?: T[];
    itemKey?: string;
    tag?: string;
    disableItem?:
        | boolean
        | ((item: T, index: number, options: Options) => boolean);
    removePayload?: boolean;
    group?: string | GroupOptions;
    handle?: string;
    dataTransfer?: (dataTransfer: DataTransfer, dragEl: HTMLElement) => void;
};
type Emit = {
    (e: 'update:model-value', items: T[]): void;
    (e: 'ready', data: Sortable | null): void;
    (e: 'choose', event: SortableEvent, options: Options): void;
    (e: 'unchoose', event: SortableEvent, options: Options): void;
    (e: 'start', event: SortableEvent, options: Options): void;
    (e: 'end', event: SortableEvent, options: Options): void;
    (e: 'add', event: SortableEvent, options: Options): void;
    (e: 'update', event: SortableEvent, options: Options): void;
    (e: 'sort', event: SortableEvent, options: Options): void;
    (e: 'remove', event: SortableEvent, options: Options): void;
    (e: 'filter', event: SortableEvent, options: Options): void;
    (
        e: 'move',
        moveEvent: MoveEvent,
        originalEvent: Event,
        options: Options
    ): void;
    (e: 'clone', event: SortableEvent, options: Options): void;
    (e: 'change', event: SortableEvent, options: Options): void;
    (
        e: 'drop',
        data: {
            items: T[];
            payload: T;
            type: 'add' | 'remove' | 'update';
            evt: SortableEvent;
            removePayloadEl: () => void;
        }
    ): void;
};

// other props are passed through attributes
// sortable options here: https://github.com/SortableJS/Sortable#options
const props = withDefaults(defineProps<Props>(), {
    itemKey: 'id',
    tag: 'div',
    disableItem: false,
    removePayload: true,
});

const emit = defineEmits<Emit>();

const { attributes, slotNames } = useVueContext();
const { kebabToCamelCase, isJsonParsable, filterPropsFromObject } =
    useCommonUtils();

const usingVModel = computed(
    () => props.modelValue !== undefined && Array.isArray(props.modelValue)
);
const sortableItems = computed(() => {
    let items = usingVModel.value ? props.modelValue : props.items;
    if (!Array.isArray(items)) items = [];
    return items;
});

const onDrop = (evt: SortableEvent, type: string) => {
    // @ts-ignore
    const transferData = evt?.originalEvent?.dataTransfer?.getData('text');
    const item = isJsonParsable(transferData)
        ? JSON.parse(transferData)
        : transferData || null;

    if (!item) return null;

    const items = [...sortableItems.value];

    if (type === 'add' && evt.newDraggableIndex !== undefined) {
        items.splice(evt.newDraggableIndex, 0, item);
    }
    if (type === 'remove' && evt.oldDraggableIndex !== undefined) {
        items.splice(evt?.oldDraggableIndex, 1);
    }
    if (
        type === 'update' &&
        evt.oldDraggableIndex !== undefined &&
        evt.newDraggableIndex !== undefined
    ) {
        items.splice(evt?.oldDraggableIndex, 1);
        items.splice(evt?.newDraggableIndex, 0, item);
    }

    console.log(evt.oldDraggableIndex, evt.newDraggableIndex);

    const removePayloadEl = () => {
        if (
            evt.oldDraggableIndex === undefined &&
            evt.newDraggableIndex === undefined
        )
            return;
        const itemParent = evt?.item?.parentElement;
        if (itemParent) itemParent?.removeChild(evt?.item);
    };
    if (props.removePayload) removePayloadEl();

    return { item, items, removePayloadEl };
};

const defaultSortableOptions = computed(() => ({
    filter: '.sortable-disabled',
    draggable: '.dragable-item',
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    animation: 300,
    scroll: true,

    setData: (dataTransfer: DataTransfer, dragEl: HTMLElement) => {
        const indexClass = Array.from(dragEl.classList).find(className =>
            className.includes('item-index-')
        );
        if (!indexClass) {
            dataTransfer.setData('text', '');
            return;
        }

        const index = parseInt(indexClass.replace('item-index-', ''));
        if (index >= 0) {
            const payload = sortableItems.value[index];
            if (!payload) {
                dataTransfer.setData('text', '');
                return;
            }
            dataTransfer.setData('text', JSON.stringify(payload));
        } else {
            dataTransfer.setData('text', '');
        }

        if (props.dataTransfer && typeof props.dataTransfer === 'function')
            props.dataTransfer(dataTransfer, dragEl);
    },

    // Element is chosen : SortableEvent
    onChoose: (evt: SortableEvent) => {
        emit('choose', evt, sortableOptions.value);
    },

    // Element is unchosen
    onUnchoose: (evt: SortableEvent) => {
        emit('unchoose', evt, sortableOptions.value);
    },

    // Element dragging started
    onStart: (evt: SortableEvent) => {
        emit('start', evt, sortableOptions.value);
    },

    // Element dragging ended
    onEnd: (evt: SortableEvent) => {
        emit('end', evt, sortableOptions.value);
    },

    onAdd: (evt: SortableEvent) => {
        const dropResult = onDrop(evt, 'add');
        if (dropResult) {
            if (usingVModel.value)
                emit('update:model-value', dropResult?.items);
            emit('drop', {
                items: dropResult?.items,
                payload: dropResult?.item,
                evt,
                type: 'add',
                removePayloadEl: dropResult?.removePayloadEl,
            });
        }

        emit('add', evt, sortableOptions.value);
    },

    // Changed sorting within list
    onUpdate: (evt: SortableEvent) => {
        const dropResult = onDrop(evt, 'update');
        if (dropResult) {
            if (usingVModel.value)
                emit('update:model-value', dropResult?.items);
            emit('drop', {
                items: dropResult?.items,
                payload: dropResult?.item,
                evt,
                type: 'update',
                removePayloadEl: dropResult?.removePayloadEl,
            });
        }

        emit('update', evt, sortableOptions.value);
    },

    // Called by any change to the list (add / update / remove)
    onSort: (evt: SortableEvent) => {
        emit('sort', evt, sortableOptions.value);
    },

    // Element is removed from the list into another list
    onRemove: (evt: SortableEvent) => {
        const dropResult = onDrop(evt, 'remove');
        if (dropResult) {
            if (usingVModel.value)
                emit('update:model-value', dropResult?.items);
            emit('drop', {
                items: dropResult?.items,
                payload: dropResult?.item,
                evt,
                type: 'remove',
                removePayloadEl: dropResult?.removePayloadEl,
            });
        }

        emit('remove', evt, sortableOptions.value);
    },

    // Attempt to drag a filtered element
    onFilter: (evt: SortableEvent) => {
        emit('filter', evt, sortableOptions.value);
    },

    // Event when you move an item in the list or between lists
    onMove: (evt: MoveEvent, originalEvt: Event) => {
        emit('move', evt, originalEvt, sortableOptions.value);
    },

    // Called when creating a clone of element
    onClone: (evt: SortableEvent) => {
        emit('clone', evt, sortableOptions.value);
    },

    // Called when dragging element changes position
    onChange: (evt: SortableEvent) => {
        emit('change', evt, sortableOptions.value);
    },
}));

const events = computed(() => [
    'onChoose',
    'onUnchoose',
    'onStart',
    'onEnd',
    'onAdd',
    'onUpdate',
    'onSort',
    'onRemove',
    'onFilter',
    'onMove',
    'onClone',
    'onChange',
]);

const sortableOptions = computed<Options>(() => {
    const options = Object.entries(attributes.value).reduce((r, [key, val]) => {
        if (events.value.includes(key)) return r;
        return { ...r, [kebabToCamelCase(key)]: val };
    }, {});

    const propsOptions = filterPropsFromObject(props, ['group', 'handle']);

    return Object.assign(defaultSortableOptions.value, options, propsOptions);
});

watch(
    () => cloneDeep(sortableOptions.value),
    (val, oldVal) => {
        update(val, oldVal);
    }
);

const sortable_el = ref(null);
const sortable = ref<Sortable | null>(null);

const initiate = () => {
    if (!sortable_el.value) return;
    sortable.value = SortableInstance.create(
        sortable_el.value,
        sortableOptions.value
    );
    emit('ready', sortable.value);
};

const update = (val: Options, oldVal: Options) => {
    if (!sortable.value) return;

    Object.entries(val || {}).forEach(([key, val]) => {
        if (['object'].includes(typeof val) || val !== (oldVal as any)[key]) {
            if (sortable.value)
                sortable.value.option(key as keyof Options, val);
        }
    });
};

const destroy = () => {
    if (sortable.value) sortable.value.destroy();
};

const applyCssClasses = (item: T, index: number) => {
    let classes = '';
    if (sortableOptions.value?.draggable !== undefined)
        classes = sortableOptions.value?.draggable.split('.').join('');
    classes = `${classes} item-index-${index}`;

    if (
        typeof props.disableItem === 'boolean' &&
        props.disableItem &&
        typeof sortableOptions.value?.filter === 'string'
    ) {
        classes = `${classes} ${sortableOptions.value?.filter
            .split('.')
            .join('')} !cursor-not-allowed`;
    }

    if (
        typeof props.disableItem === 'function' &&
        props.disableItem(item, index, sortableOptions.value) &&
        typeof sortableOptions.value?.filter === 'string'
    ) {
        classes = `${classes} ${sortableOptions.value?.filter
            .split('.')
            .join('')} !cursor-not-allowed`;
    }

    if (
        sortableOptions.value?.disabled &&
        !classes.includes('!cursor-not-allowed')
    )
        classes = `${classes} !cursor-not-allowed`;

    return classes;
};

const isItemDisabled = (item: T, index: number) => {
    if (sortableOptions.value?.disabled) return true;

    if (typeof props.disableItem === 'boolean') return props.disableItem;
    if (typeof props.disableItem === 'function')
        return props.disableItem(item, index, sortableOptions.value);

    return false;
};

onMounted(() => {
    initiate();
});

onUnmounted(() => {
    destroy();
});
</script>

<template>
    <component :is="tag" ref="sortable_el" class="sortable-root">
        <slot
            v-if="slotNames.includes('header')"
            name="header"
            :items="sortableItems"
            :options="sortableOptions"
        ></slot>

        <template
            v-for="(item, index) in sortableItems"
            :key="itemKey && item[itemKey] ? item[itemKey] : index"
        >
            <slot
                name="item"
                :item="item"
                :index="index"
                :options="sortableOptions"
                :disabled="isItemDisabled(item, index)"
                :css-class="applyCssClasses(item, index)"
            ></slot>
        </template>

        <slot
            v-if="slotNames.includes('footer')"
            name="footer"
            :items="sortableItems"
            :options="sortableOptions"
        ></slot>

        <slot
            v-if="slotNames.includes('no-items') && !sortableItems?.length"
            name="no-items"
        ></slot>
    </component>
</template>
