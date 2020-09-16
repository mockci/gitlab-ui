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

  // This helper is used to ensure a realistic delay between the directive
  // being bound and the use clicking somewhere.
  const delayBeforeClick = (ms = 1) => new Promise(resolve => setTimeout(resolve), ms);
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
      async ({ target, expectedCalls }) => {
        createComponent();

        await delayBeforeClick();
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

      return delayBeforeClick();
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

      return delayBeforeClick();
    });

    it('calls only the inner-most instance', () => {
      find('outside').trigger('click');

      expect(onClickInner.mock.calls).toEqual([[expect.any(MouseEvent)]]);
      expect(onClick.mock.calls).toEqual([]);
    });
  });

  describe('click event fired before directive binding ', () => {
    // This *attempts* to simulate something like the following situation:
    //
    //     <button @click="show = true">Show</button>
    //     <div v-if="show" v-off-click="onClick"></div>
    //
    // Without checking event timestamps, clicking on the button the first time
    // would actually call the `onClick` handler. This is because browsers fire
    // microtask ticks *during* event propagation, which means that Vue binds
    // the directive to and inserts the new element into the DOM *before* the
    // click event propagates up to the document node. This is something Vue
    // itself has to deal with:
    // https://github.com/vuejs/vue/blob/v2.6.12/src/platforms/web/runtime/modules/events.js#L53-L58
    //
    // Unfortunately, that behaviour doesn't seem to happen in Jest/jsdom. The
    // click event propagates to the document *before* the Vue binds the
    // directive to and inserts the new element into the DOM. So, instead, we
    // explicitly construct an event with a timeStamp guaranteed to be earlier
    // than when the directive is bound, in order to test the logic.
    let earlyEvent;

    const createEvent = () => new MouseEvent('click', { bubbles: true });

    beforeEach(done => {
      earlyEvent = createEvent();

      // A timeout is needed to avoid a flaky test. Since jsdom uses
      // low-resolution timestamps on events, we _must_ wait at least
      // 1 millisecond to ensure the binding timestamp is strictly larger than
      // the event's timestamp.
      setTimeout(() => {
        createComponent();
        done();
      }, 1);
    });

    it('does not call the off click handler', async () => {
      find('outside').element.dispatchEvent(earlyEvent);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does call the click handler with a later event', async () => {
      // Use the same createEvent helper, rather than Wrapper#trigger, to give
      // confidence that the previous test isn't a false positive
      await delayBeforeClick();
      const lateEvent = createEvent();
      find('outside').element.dispatchEvent(lateEvent);

      expect(onClick.mock.calls).toEqual([[lateEvent]]);
    });
  });
});
