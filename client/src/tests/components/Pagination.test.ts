import { vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Pagination from '@/components/pages/home/Pagination.vue';

vi.mock('axios');

// const wrapper = shallowMount(Pagination, {
//     props: {
//         modelValue: 10,
//         total: 20,
//     },
// });

describe('FoodAndDrinks.vue', () => {
    it('should find the component', () => {
        expect(Pagination).toBeTruthy();
    });

    it('should mount the component', () => {
        const wrapper = shallowMount(Pagination, {
            props: {
                modelValue: 10,
                total: 20,
            },
        });

        expect(wrapper.attributes('id')).toBe('preview-pagination');
    });

    it('should get props as expected', () => {
        const wrapper = shallowMount(Pagination, {
            props: {
                modelValue: 10,
                total: 20,
            },
        });

        expect(wrapper.props('modelValue')).toBe(10);
        expect(wrapper.props('total')).toBe(20);
    });

    it('should go to previous page on prev button click', () => {
        const wrapper = shallowMount(Pagination, {
            props: {
                modelValue: 10,
                total: 20,
            },
        });

        // @ts-ignore
        wrapper.vm?.onPageChange('prev');

        // @ts-ignore
        expect(wrapper.emitted()['update:model-value'][0]).toEqual([
            wrapper.props('modelValue') - 1,
        ]);
    });

    it('should go to next page on next button click', () => {
        const wrapper = shallowMount(Pagination, {
            props: {
                modelValue: 10,
                total: 20,
            },
        });

        // @ts-ignore
        wrapper.vm?.onPageChange('next');

        // @ts-ignore
        expect(wrapper.emitted()['update:model-value'][0]).toEqual([
            wrapper.props('modelValue') + 1,
        ]);
    });

    it('should go to page on direct click on page', () => {
        const wrapper = shallowMount(Pagination, {
            props: {
                modelValue: 10,
                total: 20,
            },
        });

        // @ts-ignore
        wrapper.vm?.onPageChange(5);

        // @ts-ignore
        expect(wrapper.emitted()['update:model-value'][0]).toEqual([5]);
    });
});
