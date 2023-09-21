import { mount } from '@vue/test-utils';
import useVueContext from '@/composables/vue/useVueContext';

const Component = {
    template: `
        <div>
            <header>
                <slot name="header" />
            </header>

            <main>
                <slot name="main" />
            </main>
            <footer>
                <slot name="footer" />
            </footer>
        </div>
    `,
    setup() {
        const { slotNames, attributes } = useVueContext();
        return { slotNames, attributes };
    },
    data() {
        return {
            vmSlotNames: [],
            vmAttributes: [],
        };
    },
    mounted() {
        // @ts-ignore
        this.vmSlotNames = this.slotNames;
        // @ts-ignore
        this.vmAttributes = this.attributes;
    },
};

describe('Composabe UseVueContext test', () => {
    const props = {
        foo: 'bar',
        john: 'doe',
    };
    const wrapper = mount(Component, {
        slots: {
            header: '<div>Header</div>',
            main: '<div>Main Content</div>',
            footer: '<div>Footer</div>',
        },
        props,
    });
    it('should return slotNames as array of the givenSlots', () => {
        // @ts-ignore
        expect(wrapper.vm?.$data?.vmSlotNames).toEqual([
            'header',
            'main',
            'footer',
        ]);
    });
    it('should return attributes that are not casted as props', () => {
        // @ts-ignore
        expect(wrapper.vm?.$data?.vmAttributes).toEqual(props);
    });
});
