import { shallowMount } from '@vue/test-utils';
import LoadingIcon from '../../../src/components/base/loading_icon/loading_icon.vue';

describe('loading icon component', () => {
  let wrapper;
  const createComponent = propsData => {
    wrapper = shallowMount(LoadingIcon, { propsData });
  };

  const baseCssClass = 'gl-spinner';
  const findSpinnerEl = () => wrapper.find(`.${baseCssClass}`);
  const getSpinnerClasses = () => findSpinnerEl().classes();

  afterEach(() => {
    wrapper.destroy();
  });

  describe('display', () => {
    it('should render as a block by default', () => {
      createComponent();
      expect(wrapper.element.tagName).toBe('DIV');
    });

    it('should render inline using prop', () => {
      createComponent({ inline: true });
      expect(wrapper.element.tagName).toBe('SPAN');
    });
  });

  describe('css class', () => {
    const supportedSizes = ['sm', 'md', 'lg'];
    const supportedColors = ['dark', 'light', 'orange'];
    const sizeColorCombinations = supportedSizes.reduce(
      (combinations, size) => combinations.concat(supportedColors.map(color => [size, color])),
      []
    );

    it('should render the spinner css class by default', () => {
      createComponent();
      const spinnerClasses = getSpinnerClasses();

      expect(spinnerClasses).toContain(baseCssClass);
    });

    it('should render the "md" size by default', () => {
      createComponent();
      const spinnerClasses = getSpinnerClasses();

      expect(spinnerClasses).toContain(`${baseCssClass}-md`);
    });

    it.each(supportedSizes)('should render spinner properly for size %s', size => {
      createComponent({ size });
      const spinnerClasses = getSpinnerClasses();

      expect(spinnerClasses).toContain(baseCssClass);
      expect(spinnerClasses).toContain(`${baseCssClass}-${size}`);
    });

    it.each(supportedColors)('should render spinner properly for color %s', color => {
      createComponent({ color });
      const spinnerClasses = getSpinnerClasses();

      expect(spinnerClasses).toContain(baseCssClass);
      expect(spinnerClasses).toContain(`${baseCssClass}-${color}`);
    });

    it.each(sizeColorCombinations)(
      'should render spinner properly for combination of size: "%s" and color: "%s"',
      (size, color) => {
        createComponent({ size, color });
        const spinnerClasses = getSpinnerClasses();

        expect(spinnerClasses).toContain(baseCssClass);
        expect(spinnerClasses).toContain(`${baseCssClass}-${size}`);
        expect(spinnerClasses).toContain(`${baseCssClass}-${color}`);
      }
    );
  });

  describe('aria label', () => {
    it('should default to loading', () => {
      createComponent();
      const spinnerEl = findSpinnerEl();

      expect(spinnerEl.attributes('aria-label')).toBe('Loading');
    });

    it('should change using prop', () => {
      const label = 'label';
      createComponent({ label });
      const spinnerEl = findSpinnerEl();

      expect(spinnerEl.attributes('aria-label')).toBe(label);
    });
  });

  describe('legacy sizes', () => {
    it('should warn if legacy sizes are used', () => {
      const deprecationWarning =
        "Icon sizes 1 - 5 are deprecated, please use 'sm', 'md' and 'lg' instead.";
      const legacySize = 3;

      console.warn = jest.fn(); // eslint-disable-line no-console

      createComponent({ size: legacySize });
      expect(console.warn).toHaveBeenCalledWith(deprecationWarning); // eslint-disable-line no-console

      console.warn.mockReset(); // eslint-disable-line no-console
    });

    it('should handle an invalid size', () => {
      const invalidSize = 6;

      createComponent({ size: invalidSize });
      const spinnerClasses = getSpinnerClasses();

      expect(global.console).toHaveLoggedVueErrors();

      // default size as fallback
      expect(spinnerClasses).toContain(baseCssClass);
      expect(spinnerClasses).toContain(`${baseCssClass}-md`);

      global.console.error.mockReset();
    });

    it('should convert size of 1 to "sm"', () => {
      const legacySize = 1;
      createComponent({ size: legacySize });
      const spinnerClasses = getSpinnerClasses();

      expect(spinnerClasses).toContain(baseCssClass);
      expect(spinnerClasses).toContain(`${baseCssClass}-sm`);
    });

    it.each([2, 3])('convert size of %s to "lg"', legacySize => {
      createComponent({ size: legacySize });
      const spinnerClasses = getSpinnerClasses();

      expect(spinnerClasses).toContain(baseCssClass);
      expect(spinnerClasses).toContain(`${baseCssClass}-lg`);
    });

    it.each([4, 5])('convert size of %s to "xl"', legacySize => {
      createComponent({ size: legacySize });
      const spinnerClasses = getSpinnerClasses();

      expect(spinnerClasses).toContain(baseCssClass);
      expect(spinnerClasses).toContain(`${baseCssClass}-xl`);
    });
  });
});
