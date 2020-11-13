import { mount } from '@vue/test-utils';
import GlLoadingIcon from '../loading_icon/loading_icon.vue';
import GlButton from './button.vue';

describe('button component', () => {
  let wrapper;

  const buildWrapper = (propsData = {}) => {
    wrapper = mount(GlButton, {
      propsData,
    });
  };
  const findLoadingIcon = () => wrapper.find(GlLoadingIcon);

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  describe('ellipsis button', () => {
    beforeEach(() => {
      buildWrapper({
        icon: 'ellipsis_h',
      });
    });

    it('should add `button-ellipsis-horizontal` class', () => {
      expect(wrapper.classes()).toContain('button-ellipsis-horizontal');
    });
  });

  describe('label button', () => {
    describe('default', () => {
      beforeEach(() => {
        buildWrapper({
          label: true,
        });
      });

      it('renders as a span', () => {
        expect(wrapper.element.tagName).toBe('SPAN');
      });

      it('should add `btn` and `btn-label` classes', () => {
        const classes = wrapper.classes();
        expect(classes).toContain('btn');
        expect(classes).toContain('btn-label');
      });
    });

    it.each`
      size         | expectedClass
      ${undefined} | ${'btn-md'}
      ${'small'}   | ${'btn-sm'}
    `('applies $expectedClass class when size is $size', ({ size, expectedClass }) => {
      buildWrapper({
        label: true,
        size,
      });

      expect(wrapper.classes()).toContain(expectedClass);
    });
  });

  describe('loading indicator', () => {
    beforeEach(() => {
      buildWrapper({
        loading: true,
      });
    });

    it('should render the loading indicator', () => {
      expect(findLoadingIcon().exists()).toBe(true);
    });

    it('should render the loading indicator with the `gl-button-loading-indicator` class', () => {
      expect(findLoadingIcon().classes()).toContain('gl-button-loading-indicator');
    });
  });

  it.each`
    variant      | category       | expectedClass
    ${'default'} | ${'primary'}   | ${'btn-default'}
    ${'default'} | ${'secondary'} | ${'btn-default-secondary'}
    ${'default'} | ${'tertiary'}  | ${'btn-default-tertiary'}
    ${'info'}    | ${'primary'}   | ${'btn-info'}
    ${'info'}    | ${'secondary'} | ${'btn-info-secondary'}
    ${'info'}    | ${'tertiary'}  | ${'btn-info-tertiary'}
    ${'success'} | ${'primary'}   | ${'btn-success'}
    ${'success'} | ${'secondary'} | ${'btn-success-secondary'}
    ${'success'} | ${'tertiary'}  | ${'btn-success-tertiary'}
    ${'warning'} | ${'primary'}   | ${'btn-warning'}
    ${'warning'} | ${'secondary'} | ${'btn-warning-secondary'}
    ${'warning'} | ${'tertiary'}  | ${'btn-warning-tertiary'}
    ${'danger'}  | ${'primary'}   | ${'btn-danger'}
    ${'danger'}  | ${'secondary'} | ${'btn-danger-secondary'}
    ${'danger'}  | ${'tertiary'}  | ${'btn-danger-tertiary'}
  `(
    'adds $expectedClass class when variant=$variant and category=$category',
    ({ variant, category, expectedClass }) => {
      buildWrapper({
        icon: 'ellipsis_h',
        variant,
        category,
      });

      expect(wrapper.classes()).toContain(expectedClass);
    }
  );
});
