import { vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Homepage from '@/pages/Homepage.vue';
import { appConfigProviderKey } from '@/symbols/app';
import axios from 'axios';

const baseUrl = 'https://foo.bar';
axios.defaults.baseURL = baseUrl;

describe('Homepage.vue', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    const wrapper = shallowMount(Homepage, {
        global: {
            provide: {
                // @ts-ignore
                [appConfigProviderKey]: {
                    windowWidth: 1000,
                },
            },
        },
    });

    it('should find the component', () => {
        vi.mock('axios');
        expect(Homepage).toBeTruthy();
    });

    it('should mount the component', () => {
        vi.mock('axios');
        expect(wrapper.text()).toContain(
            'Erstelle in wenigen Klicks deine Speisekarte!'
        );
    });

    it('should get templates', async () => {
        const mockResponse = { data: ['test', 'foo', 'bar'] };

        vi.spyOn(axios, 'get').mockResolvedValue(mockResponse);
        // @ts-ignore
        await wrapper.vm?.onTemplateGet();
        // @ts-ignore
        expect(wrapper.vm?.templates).toEqual(mockResponse.data);
    });

    it('should get products', async () => {
        const mockResponse = { data: ['test', 'foo', 'bar'] };

        vi.spyOn(axios, 'get').mockResolvedValue(mockResponse);
        // @ts-ignore
        await wrapper.vm?.onProductGet();
        // @ts-ignore
        expect(wrapper.vm?.products).toEqual(mockResponse.data);
    });

    it('should update template information as payload given', () => {
        const templateInformation = {
            pageSize: {
                size: 'A4',
                width: 596,
                height: 842,
            },
            background: '',
            template: {
                id: 'template-51db0676-ea05-4a45-ab5f-6cb1c579171c',
                name: 'Deme 1',
                background: '',
                product: 'product',
                container: 'container',
                restaurant: 'restaurant',
            },
            restaurant_information: {
                name: 'test_restaurant_name',
                description: 'test_restaurant_description',
                logo: 'test_restaurant_logo',
            },
            products: [
                {
                    id: 'product_id',
                    name: 'test_product_name',
                    price: 'test_product_price',
                    description: 'test_product_description',
                    logo: 'test_product_logo',
                },
            ],
        };
        // @ts-ignore
        wrapper.vm?.onUpdateTemplateInformation(templateInformation);

        // @ts-ignore
        expect(wrapper.vm?.templateInformation).toEqual(templateInformation);
    });

    it('should update preview pages as payload given', () => {
        const payload = [['foo'], ['bar']];
        // @ts-ignore
        wrapper.vm?.onUpdatePreviewPages(payload);
        // @ts-ignore
        expect(wrapper.vm?.previewPages).toEqual(payload);
    });

    it('should generate print', async () => {
        const mockResponse = { data: ['test', 'foo', 'bar'] };

        vi.spyOn(axios, 'post').mockResolvedValue(mockResponse);
        window.URL.createObjectURL = vi.fn(() => 'created object url');
        // @ts-ignore
        await wrapper.vm?.onPdfGenerate();

        expect(window.URL.createObjectURL).toBeCalledTimes(1);
    });

    it('should open print dialogue', async () => {
        const mockResponse = { data: ['test', 'foo', 'bar'] };

        vi.spyOn(axios, 'post').mockResolvedValue(mockResponse);
        window.URL.createObjectURL = vi.fn(() => 'created object url');
        window.open = vi.fn(() => null);
        // @ts-ignore
        await wrapper.vm?.openPrintDialog();

        expect(window.URL.createObjectURL).toBeCalledTimes(1);
    });
});
