import { h, ref, computed, VNode, RendererNode, RendererElement } from 'vue';

// composables
import useCommonUtils from '@/composables/utils/useCommonUtils';

// types
import { TemplateBuilderItem } from '@/types/home/home';
type HtmlMapper = {
    searchClass: string;
    replacer: string;
    isImage: boolean;
};

const useCreateTemplate = (content: 'restaurant' | 'product') => {
    const { generateId } = useCommonUtils();

    const containerCssSelector = `#${content}-template-builder`;
    const activeBorder = [
        'border: 2px solid rgb(239, 99, 68);',
        'border: 2px solid #EF6344;',
    ];

    const htmlStringMapper = computed<{
        restaurant: HtmlMapper[];
        product: HtmlMapper[];
    }>(() => ({
        restaurant: [
            {
                searchClass: 'restaurant-title',
                replacer: '[{template_restaurant_name}]',
                isImage: false,
            },
            {
                searchClass: 'restaurant-logo',
                replacer: '[{template_restaurant_logo}]',
                isImage: true,
            },
            {
                searchClass: 'restaurant-description',
                replacer: '{[template_restaurant_description]}',
                isImage: false,
            },
        ],
        product: [
            {
                searchClass: 'product-title',
                replacer: '{[template_product_name]}',
                isImage: false,
            },
            {
                searchClass: 'product-logo',
                replacer: '[{template_product_logo}]',
                isImage: true,
            },
            {
                searchClass: 'product-description',
                replacer: '{[template_product_description]}',
                isImage: false,
            },
            {
                searchClass: 'product-price',
                replacer: '{[template_product_price]}',
                isImage: false,
            },
        ],
    }));

    const restaurantContainer = computed<TemplateBuilderItem>(() => ({
        id: generateId('restaurant-'),
        tag: 'div',
        componentType: 'container',
        class: 'wrapper-div restaurant-container',
        style: {
            width: '100%',
            minWidth: '0px',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '16px',
            marginTop: 0,
            marginBottom: '24px',
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
        },
        dynamicStyle: {},
        props: {},
        attrs: {},
        title: 'Restaurant template',
        children: [],
        canAddChild: true,
    }));

    const productContainer = computed<TemplateBuilderItem>(() => ({
        id: generateId('product-'),
        tag: 'div',
        componentType: 'container',
        class: 'wrapper-div product-container',
        style: {
            width: '100%',
            minWidth: '0px',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '16px',
            marginTop: 0,
            marginBottom: '24px',
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
        },
        dynamicStyle: {},
        props: {},
        attrs: {},
        title: 'Product template',
        children: [],
        canAddChild: true,
    }));

    const wrapper = computed<TemplateBuilderItem>(() => ({
        id: generateId('wrapper-'),
        tag: 'div',
        componentType: 'container',
        class: 'wrapper-item',
        style: {
            width: '100%',
            minWidth: '0px',
            height: 'auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '16px',
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
        },
        dynamicStyle: {},
        props: {},
        attrs: {},
        children: [],
        canAddChild: true,
    }));

    const title = computed<TemplateBuilderItem>(() => ({
        id: generateId('title-'),
        tag: 'div',
        componentType: 'text',
        class: 'item-title',
        style: {
            width: 'auto',
            height: 'auto',
            fontSize: '30px',
            lineHeight: '38px',
            fontWeight: '700',
            color: '#121212',
            textAlign: 'left',
            textDecoration: 'none',
            fontStyle: 'normal',
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
        },
        dynamicStyle: {},
        props: {},
        attrs: {},
        content: 'Restaurant title',
        children: [],
        canAddChild: false,
    }));

    const image = computed<TemplateBuilderItem>(() => ({
        id: generateId('image-'),
        tag: 'img',
        componentType: 'image',
        class: 'item-image',
        style: {
            width: '100px',
            height: '100px',
            borderRadius: '6px',
            textAlign: 'left',
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
        },
        dynamicStyle: {},
        props: {},
        attrs: {},
        children: [],
        canAddChild: false,
    }));

    const template = ref<TemplateBuilderItem>(
        content === 'restaurant'
            ? restaurantContainer.value
            : productContainer.value
    );

    const dynamicTemplate = computed(() => mapDynamicTemplate(template.value));

    const activeTemplate = ref<TemplateBuilderItem>(template.value);

    const generateHtml = (template: TemplateBuilderItem) => {
        return () => renderItem(template);
    };

    const mapDynamicTemplate = (
        templateItem: TemplateBuilderItem
    ): TemplateBuilderItem => {
        if (templateItem.id === activeTemplate.value.id)
            templateItem = {
                ...templateItem,
                dynamicStyle: {
                    ...templateItem.dynamicStyle,
                    border: activeBorder[1]
                        .replace('border: ', '')
                        .replace(';', ''),
                },
            };
        else
            templateItem = {
                ...templateItem,
                dynamicStyle: {
                    ...templateItem.dynamicStyle,
                    border: 'none',
                },
            };

        templateItem = {
            ...templateItem,
            props: {
                ...templateItem.props,
                onClick: (event: MouseEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                    activeTemplate.value = templateItem;
                },
            },
        };

        if (templateItem.children.length) {
            templateItem = {
                ...templateItem,
                children: templateItem.children.map(childTemplateItem =>
                    mapDynamicTemplate(childTemplateItem)
                ),
            };
        }

        return templateItem;
    };

    const renderItem = (
        templateItem: TemplateBuilderItem
    ): VNode<
        RendererNode,
        RendererElement,
        {
            [key: string]: any;
        }
    > => {
        return h(
            templateItem.tag,
            {
                id: templateItem.id,
                key: templateItem.id,
                class: templateItem?.class ? templateItem.class : '',
                style: { ...templateItem.style, ...templateItem.dynamicStyle },
                ...templateItem.props,
                ...templateItem.attrs,
            },
            templateItem.children.length
                ? templateItem.children.map(child => renderItem(child))
                : templateItem?.content
                ? templateItem.content
                : undefined
        );
    };

    const templateString = ref<string>('');
    const setTemplateString = (template: TemplateBuilderItem) => {
        if (!template) return '';

        const container = document.querySelector(containerCssSelector);

        if (!container) return '';

        let containerHtml = container.innerHTML;
        activeBorder.forEach(border => {
            containerHtml = containerHtml.split(border).join('');
        });

        const parser = new DOMParser();
        const html = parser.parseFromString(containerHtml, 'text/html');

        const body = html.body;
        const mapper = htmlStringMapper.value[content];

        mapper.forEach(m => {
            const els = body.querySelectorAll(`.${m.searchClass}`);
            Array.from(els).forEach(el => {
                if (m.isImage) {
                    if (el.tagName === 'IMG') {
                        const image = el as HTMLImageElement;
                        image.src = m.replacer;
                        image.style.display = `table-caption`; // as dislay table-caption not used anywhere we will use it later
                        // to set image display
                    }
                } else {
                    el.textContent = m.replacer;
                }
            });
        });

        return body.innerHTML
            .split('table-caption')
            .join(`[{template_${content}_logo_display}]`);
    };

    const resetTemplate = () => {
        template.value =
            content === 'restaurant'
                ? restaurantContainer.value
                : productContainer.value;
        activeTemplate.value = { ...template.value };
    };

    return {
        restaurantContainer,
        productContainer,
        wrapper,
        title,
        image,
        template,
        dynamicTemplate,
        activeTemplate,
        generateHtml,
        templateString,
        setTemplateString,
        resetTemplate,
    };
};

export default useCreateTemplate;
