import { mount } from '@vue/test-utils';

import GlTab from './tab.vue';

const DEFAULT_TITLE_LINK_CLASS = 'gl-tab-nav-item';

describe('Tab', () => {
  let wrapper;

  const createComponent = ({ props = {} } = {}) => {
    wrapper = mount(GlTab, {
      propsData: {
        ...props,
      },
    });
  };

  afterEach(() => wrapper.destroy());

  describe.each`
    titleLinkClass          | expectedTitleLinkClassProps | type
    ${'my-class'}           | ${'my-class'}               | ${'string'}
    ${{ 'my-class': true }} | ${{ 'my-class': true }}     | ${'object'}
    ${['cls-1', 'cls-2']}   | ${['cls-1', 'cls-2']}       | ${'array'}
    ${null}                 | ${null}                     | ${'null'}
    ${undefined}            | ${DEFAULT_TITLE_LINK_CLASS} | ${'undefined'}
  `('with title link classes', ({ titleLinkClass, expectedTitleLinkClassProps, type }) => {
    beforeEach(async () => {
      createComponent({ props: { titleLinkClass } });

      await wrapper.vm.$nextTick();
    });

    it(`class is inherited from title link class of type ${type}`, () => {
      expect(wrapper.props('titleLinkClass')).toEqual(expectedTitleLinkClassProps);
    });
  });
});
