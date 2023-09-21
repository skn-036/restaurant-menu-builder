import useTemplate from '@/composables/template/useTemplate';
import { TemplateInformation } from '@/types/home/home';

const { resolveTemplateContainer, resolveRestaurant, resolveTemplateString } =
    useTemplate();

const templateInformation = {
    pageSize: {
        size: 'A4',
        width: 596,
        height: 842,
    },
    template: {
        id: 'template-51db0676-ea05-4a45-ab5f-6cb1c579171c',
        name: 'Deme 1',
        background: '',
        product:
            '<div id="product-d0e5885a-d436-4072-a9bf-523881aeb884" class="wrapper-div product-container" style="width: 100%; min-width: 0px; height: auto; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; margin: 0px 0px 24px; padding: 0px; border: none;"><div id="wrapper-ce336625-f812-4a06-abff-ab8119e4909d" class="wrapper-item product-wrapper" style="width: 100%; min-width: 0px; height: auto; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; gap: 32px; margin: 0px; padding: 0px; border: none;"><img id="product_logo-d3dc745a-8fdf-410f-97f3-577ae53e2dd8" class="item-image product-logo" src="[{template_product_logo}]" style="width: 100px; height: 100px; border-radius: 27px; text-align: left; margin: 0px; padding: 0px; border: none; display: [{template_product_logo_display}];"><div id="wrapper-0332e948-0f5a-42cd-ac26-aa66ceb32764" class="wrapper-item product-wrapper" style="width: 100%; min-width: 0px; height: auto; display: flex; flex-direction: row; justify-content: flex-start; align-items: flex-start; gap: 16px; margin: 0px; padding: 0px; border: none;"><div id="wrapper-90f82c3a-e19d-4c44-a630-1828ff66a750" class="wrapper-item product-wrapper" style="width: 100%; min-width: 0px; height: auto; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 0px; margin: 0px; padding: 0px; border: none;"><div id="product_title-57014bc3-d170-49b3-809f-e4a85bd91a01" class="item-title product-title" style="width: auto; height: auto; font-size: 20px; line-height: 28px; font-weight: 700; color: rgb(255, 255, 255); text-align: left; text-decoration: none; font-style: normal; margin: 0px; padding: 0px; white-space: normal; overflow-wrap: break-word; border: none;">{[template_product_name]}</div><div id="product_description-3716d874-d091-4ace-b6cd-46b3b712179b" class="item-title product-description" style="width: auto; height: auto; font-size: 16px; line-height: 24px; font-weight: 400; color: rgb(244, 244, 244); text-align: left; text-decoration: none; font-style: normal; margin: 0px; padding: 0px; white-space: normal; overflow-wrap: break-word; border: none;">{[template_product_description]}</div></div><div id="product_price-4305fb79-6210-486d-900b-49dda235cf2b" class="item-title product-price" style="width: auto; height: auto; font-size: 20px; line-height: 28px; font-weight: 500; color: rgb(255, 255, 255); text-align: left; text-decoration: none; font-style: normal; margin: 0px 0px 0px 16px; padding: 0px; white-space: normal; overflow-wrap: break-word; ">{[template_product_price]}</div></div></div></div>',
        container:
            '<div class="page-root [{page_root_class}]" style="[{page_root_style}]">\n        <div style="width: 100%;">[{restaurant_template}]</div>\n        <div style="width: 100%;">[{product_template}]</div>\n    </div>',
        restaurant:
            '<div id="restaurant-067903fc-2bb6-451f-a1be-cf73cd73a50c" class="wrapper-div restaurant-container" style="width: 100%; min-width: 0px; height: auto; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 48px; margin: 0px 0px 24px; padding: 0px; border: none;"><div id="wrapper-8335be12-9216-4a83-9d34-197c8fb9c400" class="wrapper-item restaurant-wrapper" style="width: 100%; min-width: 0px; height: auto; display: flex; flex-direction: row; justify-content: flex-end; align-items: center; gap: 16px; margin: 0px; padding: 0px; border: none;"><div id="restaurant_title-51a72857-2b99-4608-a4d6-f107614d95b9" class="item-title restaurant-title" style="width: auto; height: auto; font-size: 30px; line-height: 38px; font-weight: 700; color: rgb(255, 255, 255); text-align: left; text-decoration: none; font-style: normal; margin: 0px 24px 0px 0px; padding: 0px; white-space: normal; overflow-wrap: break-word; border: none;">[{template_restaurant_name}]</div><img id="restaurant_logo-883ba8a4-eb23-448f-a883-3740e131c4cd" class="item-image restaurant-logo" src="[{template_restaurant_logo}]" style="width: 75px; height: 75px; border-radius: 999px; text-align: left; margin: 0px; padding: 0px; border: none; display: [{template_restaurant_logo_display}];"></div><div id="wrapper-97f127cd-dd72-4ea7-a5f3-ca11e8563b72" class="wrapper-item restaurant-wrapper" style="width: 100%; min-width: 0px; height: auto; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; gap: 16px; margin: 0px; padding: 0px 0px 0px 160px; border: none;"><div id="restaurant_description-9413ee3e-b422-4cec-bf51-dbb29e8c7302" class="item-title restaurant-description" style="width: auto; height: auto; font-size: 20px; line-height: 28px; font-weight: 400; color: rgb(255, 255, 255); text-align: right; text-decoration: none; font-style: normal; margin: 0px; padding: 0px; white-space: normal; overflow-wrap: break-word; ">{[template_restaurant_description]}</div></div></div>',
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

const templateInformationWithoutData = {
    ...templateInformation,
    restaurant_information: {},
    products: [],
};

describe('Composable UseHttpRequest test', () => {
    describe('resolveTemplateString() function', () => {
        it('should replace default html content for restarant information', () => {
            const str = resolveTemplateString(
                templateInformation as TemplateInformation
            );
            expect(str).toContain('test_restaurant_name');
            expect(str).toContain('test_restaurant_description');
            expect(str).toContain('test_restaurant_logo');
        });

        it('should not replace default html content for restarant information', () => {
            const str = resolveTemplateString(
                // @ts-ignore
                templateInformationWithoutData as TemplateInformation
            );

            expect(str).not.toContain('test_restaurant_name');
            expect(str).not.toContain('test_restaurant_description');
            expect(str).not.toContain('test_restaurant_logo');
        });

        it('should replace default html content for product information', () => {
            const str = resolveTemplateString(
                templateInformation as TemplateInformation
            );
            expect(str).toContain('test_product_name');
            expect(str).toContain('test_product_description');
            expect(str).toContain('test_product_logo');
            expect(str).toContain('test_product_price');
        });

        it('should not replace default html content for product information', () => {
            const str = resolveTemplateString(
                // @ts-ignore
                templateInformationWithoutData as TemplateInformation
            );

            expect(str).not.toContain('test_product_name');
            expect(str).not.toContain('test_product_description');
            expect(str).not.toContain('test_product_logo');
            expect(str).not.toContain('test_product_price');
        });
    });

    describe('resolveTemplateContainer() function', () => {
        it('should resolve template container', () => {
            const str = resolveTemplateContainer(
                templateInformation as TemplateInformation
            );
            expect(str).not.toContain('[{page_root_style}]');
            expect(str).not.toContain('[{page_root_class}]');
        });
    });

    describe('resolveRestaurant() function', () => {
        it('should replace default html content for restarant information', () => {
            const str = resolveRestaurant(
                templateInformation as TemplateInformation
            );
            expect(str).toContain('test_restaurant_name');
            expect(str).toContain('test_restaurant_description');
            expect(str).toContain('test_restaurant_logo');
        });

        it('should not replace default html content for restarant information', () => {
            const str = resolveRestaurant(
                // @ts-ignore
                templateInformationWithoutData as TemplateInformation
            );

            expect(str).not.toContain('test_restaurant_name');
            expect(str).not.toContain('test_restaurant_description');
            expect(str).not.toContain('test_restaurant_logo');
        });
    });

    describe('resolveRestaurant() function', () => {
        it('should replace default html content for restarant information', () => {
            const str = resolveRestaurant(
                templateInformation as TemplateInformation
            );
            expect(str).toContain('test_restaurant_name');
            expect(str).toContain('test_restaurant_description');
            expect(str).toContain('test_restaurant_logo');
        });

        it('should not replace default html content for restarant information', () => {
            const str = resolveRestaurant(
                // @ts-ignore
                templateInformationWithoutData as TemplateInformation
            );

            expect(str).not.toContain('test_restaurant_name');
            expect(str).not.toContain('test_restaurant_description');
            expect(str).not.toContain('test_restaurant_logo');
        });
    });
});
