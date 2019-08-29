import { shallowMount, createLocalVue } from '@vue/test-utils';
import Intersperse from '../../../components/base/intersperse/intersperse.vue';

const localVue = createLocalVue();

describe('Intersperse Component', () => {
  let wrapper;

  const createComponent = (defaultSlot = [], propsData = {}) => {
    wrapper = shallowMount(Intersperse, {
      localVue,
      context: {
        props: propsData,
      },
      slots: {
        default: defaultSlot,
      },
    });
  };

  it.each`
    defaultSlotContent                             | selectorsToCheck
    ${'<button>Foo</button>'}                      | ${['button']}
    ${'<a><span>Foo</span></a><small>Bar</small>'} | ${['a', 'a span', 'small']}
  `(
    'contains all elements passed into the default slot',
    ({ defaultSlotContent, selectorsToCheck }) => {
      createComponent(defaultSlotContent);

      selectorsToCheck.forEach(selector => {
        expect(wrapper.find(selector).exists()).toBe(true);
      });
    }
  );

  it('renders an empty span if no children are given', () => {
    createComponent([]);

    expect(wrapper.find('span').exists()).toBe(true);
    expect(wrapper.findAll('span > *').length).toBe(0);
  });

  it('uses ", " as a default separator and lastSeparator', () => {
    const defaultSlotContent = '<i>Foo</i><i>Bar</i><i>Baz</i>';
    const expectedText = 'Foo, Bar, Baz';

    createComponent(defaultSlotContent);

    expect(wrapper.text()).toBe(expectedText);
  });

  it.each`
    defaultSlotContent                     | separator | expectedText
    ${'<i>Baz</i><i>Foo</i><i>Biz</i>'}    | ${', '}   | ${'Baz, Foo, Biz'}
    ${'<i>Bar</i><i>Baz</i><i>Biz</i>'}    | ${'+'}    | ${'Bar+Baz+Biz'}
    ${'<i>Bar</i><i>Baz</i><i>Biz</i>Quz'} | ${'-'}    | ${'Bar-Baz-Biz-Quz'}
  `(
    'intersperses each direct child with a given separator',
    ({ defaultSlotContent, separator, expectedText }) => {
      createComponent(defaultSlotContent, { separator });

      expect(wrapper.text()).toBe(expectedText);
    }
  );

  it.each`
    defaultSlotContent                  | separator | lastSeparator | expectedText
    ${'<i>Foo</i><i>Bar</i>'}           | ${','}    | ${' and '}    | ${'Foo and Bar'}
    ${'<i>Foo</i><i>Bar</i><i>Baz</i>'} | ${','}    | ${'+'}        | ${'Foo,Bar,+Baz'}
    ${'<i>Foo</i><i>Bar</i><i>Baz</i>'} | ${','}    | ${' and '}    | ${'Foo,Bar, and Baz'}
    ${'<i>Foo</i><i>Bar</i><i>Baz</i>'} | ${'+'}    | ${' and '}    | ${'Foo+Bar+ and Baz'}
  `(
    'adds a custom lastSeparator',
    ({ defaultSlotContent, separator, lastSeparator, expectedText }) => {
      createComponent(defaultSlotContent, { separator, lastSeparator });

      expect(wrapper.text()).toBe(expectedText);
    }
  );

  it.each`
    defaultSlotContent              | expectedText
    ${'<i>Foo</i> <i>Bar</i>'}      | ${'Foo, Bar'}
    ${'<i>Foo</i>\n<i>Bar</i>'}     | ${'Foo, Bar'}
    ${'<i>Foo</i>\t<i>Bar</i>'}     | ${'Foo, Bar'}
    ${'<i>Foo</i>    <i>Bar</i>'}   | ${'Foo, Bar'}
    ${'<i>Foo</i>&nbsp;<i>Bar</i>'} | ${'Foo, Bar'}
    ${'<i>Foo</i><i>Bar</i>  '}     | ${'Foo, Bar'}
    ${'<i>Foo</i><i>Bar</i>\n'}     | ${'Foo, Bar'}
  `(
    'strips whitespace elements that are direct children of the slot',
    ({ defaultSlotContent, expectedText }) => {
      createComponent(defaultSlotContent);

      expect(wrapper.text()).toBe(expectedText);
    }
  );

  it.each`
    defaultSlotContent                                  | expectedText
    ${'<i>Foo Bar</i><i>Baz</i>'}                       | ${'Foo Bar, Baz'}
    ${'<i>Foo Bar</i><i>Baz Qaz</i><small>Qiz</small>'} | ${'Foo Bar, Baz Qaz, Qiz'}
  `(
    'preserves whitespace elements that are not direct children of the slot',
    ({ defaultSlotContent, expectedText }) => {
      createComponent(defaultSlotContent);

      expect(wrapper.text()).toBe(expectedText);
    }
  );
});