import { useAttrs, useSlots, computed } from 'vue';

const useVueContext = (emptyStringToTrueException: string[] = []) => {
    const attrs = useAttrs();
    const attributes = computed(() =>
        Object.entries(attrs || {}).reduce((r, [key, value]) => {
            return {
                ...r,
                [key]:
                    value === '' && !emptyStringToTrueException.includes(key)
                        ? true
                        : value,
            };
        }, {})
    );

    const slots = useSlots();
    const slotNames = computed(() => Object.keys(slots));

    return {
        attributes,
        slots,
        slotNames,
    };
};

export default useVueContext;
