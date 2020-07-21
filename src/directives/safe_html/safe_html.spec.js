import { shallowMount } from '@vue/test-utils';
import safeHtml from './safe_html';

describe('safe html directive', () => {
  let wrapper;

  const createComponent = ({ template, html, config } = {}) => {
    const defaultTemplate = `<div v-safe-html="rawHtml"></div>`;
    const defaultHtml = 'hello <script>alert(1)</script>world';

    const component = {
      directives: {
        safeHtml,
      },
      data() {
        return {
          rawHtml: html || defaultHtml,
          config: config || {},
        };
      },
      template: template || defaultTemplate,
    };

    wrapper = shallowMount(component);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  describe('default', () => {
    it('should remove the script tag', () => {
      createComponent();

      expect(wrapper.html()).toEqual('<div>hello world</div>');
    });

    it('should remove javascript hrefs', () => {
      createComponent({ html: '<a href="javascript:prompt(1)">click here</a>' });

      expect(wrapper.html()).toEqual('<div><a>click here</a></div>');
    });
  });

  describe('advance config', () => {
    const template = '<div v-safe-html:[config]="rawHtml"></div>';
    it('should only allow <b> tags', () => {
      createComponent({
        template,
        html: '<a href="javascript:prompt(1)"><b>click here</b></a>',
        config: { allowedTags: ['b'] },
      });

      expect(wrapper.html()).toEqual('<div><b>click here</b></div>');
    });

    it('should strip all html tags', () => {
      createComponent({
        template,
        html: '<a href="javascript:prompt(1)"><u>click here</u></a>',
        config: { allowedTags: [] },
      });

      expect(wrapper.html()).toEqual('<div>click here</div>');
    });
  });
});
