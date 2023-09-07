<script setup lang="ts">
// composables
import useCommonUtils from '@/composables/utils/useCommonUtils';

// types
type Props = {
    propName: string;
    info?: string;
};

defineProps<Props>();

// props
const { wordCapitalize, camelToKebabCase } = useCommonUtils();

// const title = computed(() =>
//     stringCapitalize(camelToKebabCase(props.propName).split('-').join(' '))
// );
</script>

<template>
    <div class="w-full grid grid-cols-2">
        <div class="col-span-1">
            <div class="flex-start h-full">
                <div class="font-medium">
                    {{
                        wordCapitalize(
                            camelToKebabCase(propName).split('-').join(' ')
                        )
                    }}
                </div>
            </div>
        </div>

        <div class="col-span-1">
            <div class="flex-end">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
