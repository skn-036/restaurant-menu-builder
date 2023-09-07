// @ts-ignore
import tinyEmitter from 'tiny-emitter/instance';

// types
import { TinyEmitter, ConfirmModal } from '@/types/ui/ui.ts';

const useModal = () => {
    const showConfirmModal = (
        data?: ConfirmModal | null,
        callback?: (confirmed: boolean | null) => void
    ) => {
        const emitter = tinyEmitter as TinyEmitter;
        emitter.emit('show-confirm-modal', data, callback);
    };

    return {
        showConfirmModal,
    };
};

export default useModal;
