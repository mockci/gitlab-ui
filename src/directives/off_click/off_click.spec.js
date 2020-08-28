import { merge } from 'lodash';
import { mount } from '@vue/test-utils';
import { OffClickDirective } from './off_click';

describe('off click directive', () => {
  let wrapper;
  let onClick;

  const defaultTemplate = `
    <div data-testid="outside">
      <div v-off-click="onClick" data-testid="bound">
        <div data-testid="inside"></div>
      </div>
    </div>
  `;

  const createComponent = component => {
    wrapper = mount(
      merge(
        {
          directives: {
            offClick: OffClickDirective,
          },
          methods: {
            onClick,
          },
          template: defaultTemplate,
        },
        component
      ),
      {
        attachToDocument: true,
      }
    );
  };

  const find = testid => wrapper.find(`[data-testid="${testid}"]`);

  beforeEach(() => {
    jest.clearAllMocks();
    onClick = jest.fn();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('given a callback', () => {
    it.each`
      target       | expectedCalls
      ${'outside'} | ${[[expect.any(MouseEvent)]]}
      ${'bound'}   | ${[]}
      ${'inside'}  | ${[]}
    `(
      'is called with $expectedCalls when clicking on $target element',
      ({ target, expectedCalls }) => {
        createComponent();

        find(target).trigger('click');

        expect(onClick.mock.calls).toEqual(expectedCalls);
      }
    );
  });

  describe('given multiple instances', () => {
    let onClickSibling;

    beforeEach(() => {
      onClickSibling = jest.fn();

      createComponent({
        methods: {
          onClickSibling,
        },
        template: `
          <div data-testid="outside">
            <div v-off-click="onClick" data-testid="first"></div>
            <div v-off-click="onClickSibling" data-testid="sibling"></div>
          </div>
        `,
      });
    });

    it.each`
      target       | onClickCalls                  | onClickSiblingCalls
      ${'outside'} | ${[[expect.any(MouseEvent)]]} | ${[[expect.any(MouseEvent)]]}
      ${'first'}   | ${[]}                         | ${[[expect.any(MouseEvent)]]}
      ${'sibling'} | ${[[expect.any(MouseEvent)]]} | ${[]}
    `(
      'calls the expected callbacks when $target is clicked',
      ({ target, onClickCalls, onClickSiblingCalls }) => {
        find(target).trigger('click');

        expect(onClick.mock.calls).toEqual(onClickCalls);
        expect(onClickSibling.mock.calls).toEqual(onClickSiblingCalls);
      }
    );
  });

  describe('global event binding', () => {
    beforeEach(() => {
      jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'removeEventListener');
    });

    it('does not attach the global listener if not passed a callback', () => {
      createComponent({
        data: () => ({ foo: null }),
        template: '<div v-off-click="foo"></div>',
      });

      expect(document.addEventListener).not.toHaveBeenCalled();
    });

    it('attaches the global listener on first initialisation', () => {
      createComponent();

      expect(document.addEventListener.mock.calls).toEqual([['click', expect.any(Function)]]);
    });

    it('detaches the global listener when last binding is removed', () => {
      createComponent();

      wrapper.destroy();

      expect(document.removeEventListener.mock.calls).toEqual([['click', expect.any(Function)]]);
    });

    it('only binds once, even with multiple instances', () => {
      createComponent({
        template: `
          <div>
            <div v-off-click="onClick"></div>
            <div v-off-click="onClick"></div>
          </div>
        `,
      });

      expect(document.addEventListener.mock.calls).toEqual([['click', expect.any(Function)]]);
    });

    it('only unbinds once there are no instances', async () => {
      createComponent({
        data: () => ({
          instances: 2,
        }),
        template: `
          <div>
            <div v-if="instances >= 1" v-off-click="onClick"></div>
            <div v-if="instances >= 2" v-off-click="onClick"></div>
          </div>
        `,
      });

      wrapper.setData({ instances: 1 });
      await wrapper.vm.$nextTick();

      expect(document.removeEventListener).not.toHaveBeenCalled();

      wrapper.setData({ instances: 0 });
      await wrapper.vm.$nextTick();

      expect(document.removeEventListener.mock.calls).toEqual([['click', expect.any(Function)]]);
    });
  });

  describe('multiple instances on the same element', () => {
    let onClickInner;

    beforeEach(() => {
      onClickInner = jest.fn();

      const HigherOrder = {
        directives: {
          offClick: OffClickDirective,
        },
        methods: {
          onClickInner,
        },
        template: '<div v-off-click="onClickInner"></div>',
      };

      createComponent({
        components: {
          HigherOrder,
        },
        template: `
          <div data-testid="outside">
            <higher-order v-off-click="onClick" />
          </div>
        `,
      });
    });

    it('calls only the inner-most instance', () => {
      find('outside').trigger('click');

      expect(onClickInner.mock.calls).toEqual([[expect.any(MouseEvent)]]);
      expect(onClick.mock.calls).toEqual([]);
    });
  });
});
