import { vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import FoodAndDrinks from '@/components/pages/home/FoodAndDrinks.vue';

vi.mock('axios');

const wrapper = shallowMount(FoodAndDrinks, {
    props: {
        nothing: 'nothing',
    },
});

describe('FoodAndDrinks.vue', () => {
    it('should find the component', () => {
        expect(FoodAndDrinks).toBeTruthy();
    });

    it('should mount the component', () => {
        expect(wrapper.attributes('id')).toBe('food-and-drinks');
    });
});
