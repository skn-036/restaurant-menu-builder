import { h, ref, computed, VNode, RendererNode, RendererElement } from 'vue';

// composables
import useCommonUtils from '@/composables/utils/useCommonUtils';

// types
import { TemplateBuilderItem } from '@/types/home/home';

const useCreateTemplate = (content: 'restaurant' | 'product') => {
    const { generateId } = useCommonUtils();

    const restaurantContainer = computed<TemplateBuilderItem>(() => ({
        id: generateId('restaurant-'),
        tag: 'div',
        componentType: 'container',
        class: 'wrapper-div restaurant-container',
        style: {
            width: '100%',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
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
        dynamicStyle: { minHeight: '480px' },
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
            height: 'auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '32px',
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
        },
        dynamicStyle: { minHeight: '480px' },
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
        dynamicStyle: { minHeight: '30px' },
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
            fontSize: '30px',
            lineHeight: '38px',
            fontWeight: '700',
            color: '#121212',
            textAlign: 'left',
            textDecoration: 'none',
            fontStyle: 'normal',
            width: 'max-content',
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
                    border: '2px solid #EF6344',
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
    };
};

export default useCreateTemplate;
