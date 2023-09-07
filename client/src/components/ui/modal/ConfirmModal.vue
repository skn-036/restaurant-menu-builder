<script setup lang="ts">
import { ref, computed } from 'vue';

import Button from '@/components/ui/buttons/Button.vue';

// @ts-ignore
import tinyEmitter from 'tiny-emitter/instance';

// types
import { TinyEmitter, ConfirmModal } from '@/types/ui/ui.ts';
type StrictConfirmModal = ConfirmModal & {
    message: string;
    actionButton: {
        class: string;
        text: string;
        icon: string;
    };
    returnButton: {
        class: string;
        text: string;
        icon: string;
    };
};

const emitter = tinyEmitter as TinyEmitter;

const show = ref(false);
const initialModalData = computed<StrictConfirmModal>(() => ({
    message: `Are you sure to delete?`,
    actionButton: {
        class: '!py-3 !gap-2',
        text: 'Proceed',
        icon: 'check',
    },
    returnButton: {
        class: '!py-3 !gap-2',
        text: 'Go back',
        icon: 'arrow-left',
    },
}));

const setModalData = (data?: ConfirmModal | null): StrictConfirmModal => {
    if (!data || !Object.keys(data).length) return initialModalData.value;

    let { message, actionButton, returnButton } = data;
    let compared = { ...initialModalData.value };
    if (message) {
        compared = { ...compared, message };
    }

    if (actionButton) {
        const comparedActionButton = {
            class:
                actionButton.class && typeof actionButton.class === 'string'
                    ? actionButton.class
                    : initialModalData.value.actionButton.class,
            text:
                actionButton.text && typeof actionButton.text === 'string'
                    ? actionButton.text
                    : initialModalData.value.actionButton.text,
            icon:
                actionButton.icon && typeof actionButton.text === 'string'
                    ? actionButton.icon
                    : initialModalData.value.actionButton.icon,
        };

        compared = { ...compared, actionButton: comparedActionButton };
    }

    if (returnButton) {
        const comparedReturnButton = {
            class:
                returnButton.class && typeof returnButton.class === 'string'
                    ? returnButton.class
                    : initialModalData.value.returnButton.class,
            text:
                returnButton.text && typeof returnButton.text === 'string'
                    ? returnButton.text
                    : initialModalData.value.returnButton.text,
            icon:
                returnButton.icon && typeof returnButton.text === 'string'
                    ? returnButton.icon
                    : initialModalData.value.returnButton.icon,
        };

        compared = { ...compared, returnButton: comparedReturnButton };
    }

    return compared;
};
const modalData = ref<StrictConfirmModal>(initialModalData.value);

const onButtonClick = (
    confirmed: boolean | null,
    callback?: (confirmed: boolean | null) => void
) => {
    if (typeof callback === 'function') callback(confirmed);

    const actionButton = document.querySelector('#action-button');
    const returnButton = document.querySelector('#return-button');
    const overlay = document.querySelector('#confirm-modal-overlay');
    const cancelButton = document.querySelector('#cancel-button');

    if (actionButton)
        actionButton.removeEventListener('click', () => {
            onButtonClick(true, callback);
        });

    if (returnButton)
        returnButton.removeEventListener('click', () => {
            onButtonClick(false, callback);
        });
    if (overlay)
        overlay.removeEventListener('click', () => {
            onButtonClick(null, callback);
        });

    if (cancelButton)
        cancelButton.removeEventListener('click', () => {
            onButtonClick(null, callback);
        });

    show.value = false;
};

emitter.on(
    'show-confirm-modal',
    (data: ConfirmModal, callback?: (confirmed: boolean | null) => void) => {
        show.value = true;
        modalData.value = setModalData(data);

        setTimeout(() => {
            const actionButton = document.querySelector('#action-button');
            const returnButton = document.querySelector('#return-button');
            const overlay = document.querySelector('#confirm-modal-overlay');
            const cancelButton = document.querySelector('#cancel-button');

            if (actionButton)
                actionButton.addEventListener('click', () => {
                    onButtonClick(true, callback);
                });
            if (returnButton)
                returnButton.addEventListener('click', () => {
                    onButtonClick(false, callback);
                });
            if (overlay)
                overlay.addEventListener('click', () => {
                    onButtonClick(null, callback);
                });

            if (cancelButton)
                cancelButton.addEventListener('click', () => {
                    onButtonClick(null, callback);
                });
        }, 100);
    }
);
</script>

<template>
    <Teleport to="body">
        <!-- overlay -->
        <div
            v-if="show"
            id="confirm-modal-overlay"
            class="w-screen h-screen fixed bg-gray-200 z-[1110] top-0 left-0 opacity-30"
        ></div>

        <!-- modal -->
        <Transition
            enter-from-class="scale-75 opacity-0"
            leave-to-class="scale-75 opacity-0"
            enter-active-class="transition ease-out duration-300"
            leave-active-class="transition ease-out duration-300"
        >
            <div
                v-if="show"
                class="confirm-modal rounded-md border border-gray-300 shadow-md shadow-gray-600 bg-white fixed top-20 w-11/12 md:w-3/4 lg:w-3/5 xl:w-2/5 left-[4%] md:left-[12.5%] lg:left-[20%] xl:left-[30%] z-[1111]"
            >
                <div
                    class="flex-between p-4 font-bold border-b border-gray-300"
                >
                    <div class="">
                        {{ modalData.message }}
                    </div>

                    <Icon
                        id="cancel-button"
                        type="x"
                        size="16"
                        stroke-width="3px"
                        class="cursor-pointer"
                    />
                </div>

                <div class="p-4 w-full flex-end">
                    <div class="flex-start">
                        <Button
                            id="return-button"
                            class="mr-2 text-sm"
                            :class="[modalData.returnButton.class]"
                            :label="modalData.returnButton.text"
                            :icon="modalData.returnButton.icon"
                        />
                        <Button
                            id="action-button"
                            class="text-sm"
                            :class="[modalData.actionButton.class]"
                            :label="modalData.actionButton.text"
                            :icon="modalData.actionButton.icon"
                        />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
