import { TemplateInformation } from '@/types/pdf';

export const resolveTemplateString = (
    templateInformation: TemplateInformation
) => {
    let templateString = '';
    templateString = resolveTemplateContainer(
        templateInformation,
        templateString
    );
    templateString = resolveRestaurantInformation(
        templateInformation,
        templateString
    );
    templateString = resolveProducts(templateInformation, templateString);

    // templateString = resolveSizes(templateInformation, templateString);

    return templateString;
};

const resolveTemplateContainer = (
    templateInformation: TemplateInformation,
    templateString: string = ''
) => {
    const { container } = templateInformation.template;
    // const { width, height } = templateInformation.pageSize;

    if (!templateString) templateString = container;

    // sizing is done by scale wr to A4 size. dynamic width height not needed in this case
    const pageRootStyle = `width: 596px; height: 842px;`;

    templateString = templateString
        .split('[{page_root_style}]')
        .join(pageRootStyle);

    return templateString;
};

const resolveRestaurantInformation = (
    templateInformation: TemplateInformation,
    templateString: string = ''
) => {
    const { restaurant_information } = templateInformation;
    const { restaurant } = templateInformation.template;

    templateString = templateString
        .split('[{restaurant_template}]')
        .join(restaurant);

    templateString = templateString
        .split('[{template_restaurant_name}]')
        .join(restaurant_information.name ? restaurant_information.name : '')
        .split('[{template_restaurant_logo}]')
        .join(restaurant_information.logo ? restaurant_information.logo : '')
        .split('[{template_restaurant_logo_display}]')
        .join(restaurant_information.logo ? 'block' : 'none')
        .split('{[template_restaurant_description]}')
        .join(
            restaurant_information.description &&
                typeof restaurant_information.description === 'string'
                ? restaurant_information.description
                : ''
        );

    return templateString;
};

const resolveProducts = (
    templateInformation: TemplateInformation,
    templateString: string = ''
) => {
    const { products } = templateInformation;
    const { product: productTemplate } = templateInformation.template;

    if (!products.length)
        return templateString.split('[{product_template}]').join('');

    let productTemplateString = '';
    products.forEach(product => {
        const resolvedProduct = productTemplate
            .split('[{template_product_id}]')
            .join(product.id)
            .split('[{template_product_logo}]')
            .join(product.logo ? product.logo : '')
            .split('[{template_product_logo_display}]')
            .join(product.logo ? 'block' : 'none')
            .split('{[template_product_name]}')
            .join(product.name ? product.name : '')
            .split('{[template_product_description]}')
            .join(
                product.description && typeof product.description === 'string'
                    ? product.description
                    : ''
            )
            .split('{[template_product_price]}')
            .join(
                !product.price
                    ? ''
                    : typeof product.price === 'string'
                    ? `€${product.price}`
                    : typeof product.price === 'number'
                    ? `€${product.price.toString()}`
                    : ''
            );

        productTemplateString = `${productTemplateString}${resolvedProduct}`;
    });

    return templateString
        .split('[{product_template}]')
        .join(productTemplateString);
};

// resolve pixel values to specific page size
const resolveSizes = (
    templateInformation: TemplateInformation,
    templateString: string = ''
) => {
    const { template, pageSize } = templateInformation;
    const { mapper } = template;
    const { size } = pageSize;

    if (!mapper) return templateString;

    mapper.forEach(map => {
        templateString = templateString.split(map.key).join(map[size]);
    });

    return templateString;
};
