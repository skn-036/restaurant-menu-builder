<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import useCommonUtils from '@/composables/utils/useCommonUtils';

import { UiTab } from '@/types/ui/ui';

type Props = {
    tabs: UiTab[] | string[];
    disabled?: (tab: UiTab) => boolean;
    activeTab: UiTab | string | null;
    transitionEnterActiveClass: string;
    transitionLeaveActiveClass: string;
    transitionEnterClass: string;
    transitionLeaveClass: string;
    tabClass: string;
    tabActiveClass: string;
};

type Emit = {
    (e: 'on-tab-change', tab: UiTab): void;
};

const props = withDefaults(defineProps<Props>(), {
    activeTab: null,
    transitionEnterActiveClass: 'transition duration-300',
    transitionLeaveActiveClass: 'transition duration-300',
    transitionEnterClass: 'opacity-0',
    transitionLeaveClass: 'opacity-0',
    tabClass: '',
    tabActiveClass: '',
});

const emit = defineEmits<Emit>();

const { stringCapitalize } = useCommonUtils();

const headerTabs = computed(() => {
    return props.tabs.map(tab =>
        typeof tab === 'string'
            ? { tab, title: stringCapitalize(tab.split('_').join(' ')) }
            : tab
    );
});

const setHeaderActiveTab = () => {
    if (!props.activeTab) return headerTabs.value[0];
    if (typeof props.activeTab === 'string')
        return {
            tab: props.activeTab,
            title: stringCapitalize(props.activeTab.split('_').join(' ')),
        };
    return props.activeTab;
};
const activeHeaderTab = ref<UiTab>(setHeaderActiveTab());

watch(
    () => activeHeaderTab.value,
    () => {
        emit('on-tab-change', activeHeaderTab.value);
    }
);

watch(
    () => props.activeTab,
    tab => {
        if (!tab) return;
        activeHeaderTab.value =
            typeof tab === 'string'
                ? { tab, title: stringCapitalize(tab.split('_').join(' ')) }
                : tab;
    }
);

const onTabClick = (tab: UiTab) => {
    if (tab.tab === activeHeaderTab.value.tab) return;
    if (typeof props.disabled === 'function' && props.disabled(tab)) return;

    activeHeaderTab.value = tab;
};
</script>

<template>
    <div class="w-full flex flex-col">
        <div class="flex-between w-full border-b border-slate-300">
            <div class="flex-start flex-wrap">
                <div
                    v-for="tabItem in headerTabs"
                    :key="tabItem.tab"
                    class="flex-center px-4 h-9 cursor-pointer font-bold text-dark border-l border-slate-300 last:border-r"
                    :class="[
                        activeHeaderTab.tab === tabItem.tab
                            ? `bg-gradient text-white shadow-sm shadow-gray-400 ${
                                  tabActiveClass ? tabActiveClass : ''
                              }`
                            : '',
                        tabClass ? tabClass : '',
                        typeof disabled === 'function' &&
                        disabled(tabItem) &&
                        activeHeaderTab.tab !== tabItem.tab
                            ? '!cursor-not-allowed opacity-50'
                            : '',
                    ]"
                    @click="onTabClick(tabItem)"
                >
                    {{ tabItem.title }}
                </div>
            </div>
            <slot name="after_tab_button"></slot>
        </div>

        <div class="flex-1">
            <Transition
                mode="out-in"
                :enter-from-class="transitionEnterClass"
                :leave-to-class="transitionLeaveClass"
                :enter-active-class="transitionEnterActiveClass"
                :leave-active-class="transitionLeaveActiveClass"
            >
                <slot :active-tab="activeHeaderTab">{{
                    `Tab ${activeHeaderTab.title}`
                }}</slot>
            </Transition>
        </div>
    </div>
</template>
