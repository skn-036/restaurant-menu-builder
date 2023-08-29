<script setup lang="ts">
import { computed } from 'vue';

type Props = {
    previewPages: string[];
    activePreview: string | null;
};

type Emit = {
    (e: 'update-page', activePage: string): void;
};

const props = withDefaults(defineProps<Props>(), {
    activePreview: null,
});

const emit = defineEmits<Emit>();

const pages = computed(() => {
    return props.previewPages.map((page, index) => ({
        path: page,
        index,
        page: index + 1,
    }));
});

const activePage = computed(() => {
    const page = pages.value.find(page => page.path === props.activePreview);
    return page ? page : null;
});

const onPageChange = (page: 'prev' | 'next' | number) => {
    if (page === 'prev') {
        if (!activePage.value) {
            emit('update-page', pages.value[0].path);
            return;
        }
        if (activePage.value && activePage.value?.index <= 0) return;
        emit('update-page', pages.value[activePage.value.index - 1].path);
    } else if (page === 'next') {
        if (!activePage.value) {
            emit('update-page', pages.value[pages.value.length - 1].path);
            return;
        }
        if (
            activePage.value &&
            activePage.value?.index >= pages.value.length - 1
        )
            return;
        emit('update-page', pages.value[activePage.value.index + 1].path);
    } else {
        if (activePage.value?.index === page) return;
        emit('update-page', pages.value[page].path);
    }
};
</script>

<template>
    <div
        v-if="pages.length"
        class="w-full bg-white h-[68px] px-4 py-4 flex-center rounded-xl"
    >
        <div class="w-full border-t h-[36px] border-[#d9d9d9]">
            <div class="h-full grid grid-cols-12 gap-x-4">
                <!-- previous -->
                <div
                    class="col-span-2 flex-start h-full items-end gap-3 cursor-pointer"
                    @click="onPageChange('prev')"
                >
                    <svg
                        v-if="activePage && activePage.index > 0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="8"
                        viewBox="0 0 16 8"
                        fill="none"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M16.0001 4.00013C16.0001 4.19904 15.9211 4.38981 15.7804 4.53046C15.6398 4.67111 15.449 4.75013 15.2501 4.75013H2.6601L4.7601 6.70013C4.90597 6.83539 4.99213 7.02306 4.99963 7.22184C5.00713 7.42063 4.93536 7.61426 4.8001 7.76013C4.66484 7.906 4.47717 7.99216 4.27838 7.99966C4.07959 8.00716 3.88597 7.93539 3.7401 7.80013L0.240098 4.55013C0.164369 4.47992 0.103955 4.39483 0.0626404 4.30019C0.0213255 4.20555 0 4.10339 0 4.00013C0 3.89686 0.0213255 3.79471 0.0626404 3.70007C0.103955 3.60543 0.164369 3.52034 0.240098 3.45013L3.7401 0.200128C3.88597 0.0648677 4.07959 -0.00690637 4.27838 0.000595089C4.47717 0.00809654 4.66484 0.094259 4.8001 0.240128C4.93536 0.385997 5.00713 0.579624 4.99963 0.778412C4.99213 0.977201 4.90597 1.16487 4.7601 1.30013L2.6601 3.25013H15.2501C15.449 3.25013 15.6398 3.32915 15.7804 3.4698C15.9211 3.61045 16.0001 3.80122 16.0001 4.00013Z"
                            fill="#AFAFAF"
                        />
                    </svg>

                    <div
                        v-if="activePage && activePage.index > 0"
                        class="text-sm font-medium text-[#7A7878] leading-3"
                    >
                        Vorherige
                    </div>
                </div>

                <!-- pagination buttons -->
                <div
                    class="col-span-8 flex flex-row justify-center h-full items-end"
                >
                    <div
                        v-for="page in pages"
                        class="px-4 flex items-end h-[36px] cursor-pointer text-sm leading-4 font-medium"
                        :class="[
                            activePage && activePage.page === page.page
                                ? 'text-theme border-t-2 border-theme'
                                : 'text-[#7A7878]',
                        ]"
                        @click="onPageChange(page.index)"
                    >
                        {{ page.page }}
                    </div>
                </div>

                <!-- next -->
                <div
                    class="col-span-2 flex-start h-full items-end gap-3 cursor-pointer"
                    @click="onPageChange('next')"
                >
                    <div
                        v-if="activePage && activePage.index < pages.length - 1"
                        class="text-sm font-medium text-[#7A7878] leading-3"
                    >
                        Nächste
                    </div>

                    <svg
                        v-if="activePage && activePage.index < pages.length - 1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="8"
                        viewBox="0 0 16 8"
                        fill="none"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M0 4.00013C0 3.80122 0.0790175 3.61045 0.21967 3.4698C0.360322 3.32915 0.551088 3.25013 0.75 3.25013H13.34L11.24 1.30013C11.1678 1.23315 11.1094 1.15261 11.0683 1.06309C11.0272 0.973577 11.0042 0.876842 11.0005 0.778412C10.9968 0.679982 11.0125 0.581784 11.0467 0.489425C11.0809 0.397066 11.133 0.312355 11.2 0.240127C11.3353 0.0942584 11.5229 0.00809599 11.7217 0.00059454C11.8201 -0.0031198 11.9183 0.0125894 12.0107 0.0468253C12.1031 0.0810613 12.1878 0.133153 12.26 0.200128L15.76 3.45013C15.8357 3.52034 15.8961 3.60543 15.9375 3.70007C15.9788 3.79471 16.0001 3.89686 16.0001 4.00013C16.0001 4.10339 15.9788 4.20555 15.9375 4.30019C15.8961 4.39483 15.8357 4.47992 15.76 4.55013L12.26 7.80013C12.1141 7.93539 11.9205 8.00716 11.7217 7.99966C11.5229 7.99216 11.3353 7.906 11.2 7.76013C11.0647 7.61426 10.993 7.42063 11.0005 7.22184C11.008 7.02306 11.0941 6.83539 11.24 6.70013L13.34 4.75013H0.75C0.551088 4.75013 0.360322 4.67111 0.21967 4.53046C0.0790175 4.38981 0 4.19904 0 4.00013Z"
                            fill="#AFAFAF"
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>
