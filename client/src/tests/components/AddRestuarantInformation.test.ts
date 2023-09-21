import { vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import AddRestuarantInformation from '@/components/pages/home/AddRestuarantInformation.vue';
import {
    templateInformationProviderKey,
    templateProviderKey,
} from '@/symbols/home/home';

vi.mock('axios');

const templateInformation = {
    pageSize: { size: 'A4' },
    template: {},
    restaurant_information: {
        name: 'I am restaurant name',
        description: null,
        logo: null,
    },
    products: [],
};

const wrapper = shallowMount(AddRestuarantInformation, {
    global: {
        provide: {
            // @ts-ignore
            [templateInformationProviderKey]: {
                templateInformation,
            },
            // @ts-ignore
            [templateProviderKey]: {
                templates: [],
            },
        },
    },
});

describe('AddRestaurantInformation.vue', () => {
    it('should find the component', () => {
        expect(AddRestuarantInformation).toBeTruthy();
    });

    it('should mount the component', () => {
        expect(wrapper.text()).toContain(
            'Schreibe ein paar Sätze um deinen Kunden die Speisekarte vorzustellen'
        );
    });

    it('should render provided value as expected', () => {
        expect(
            // @ts-ignore
            wrapper.vm?.templateInformation?.restaurant_information?.name
        ).toBe(templateInformation.restaurant_information?.name);
    });
});
