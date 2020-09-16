import { getEventLikeTimeStamp } from './get_event_like_time_stamp';

/**
 * Map<HTMLElement, { bindTimeStamp: number, callback: Function }>
 */
const callbacks = new Map();

/**
 * Is a global listener already set up?
 */
let listening = false;

const globalListener = event => {
  callbacks.forEach(({ bindTimeStamp, callback }, element) => {
    if (
      // Ignore events that aren't off-element
      element.contains(event.target) ||
      // Only consider events triggered after the directive was bound
      event.timeStamp <= bindTimeStamp
    ) {
      return;
    }

    callback(event);
  });
};

const startListening = () => {
  if (listening) {
    return;
  }

  document.addEventListener('click', globalListener);
  listening = true;
};

const stopListening = () => {
  if (!listening) {
    return;
  }

  document.removeEventListener('click', globalListener);
  listening = false;
};

const bind = (el, { value }) => {
  if (typeof value !== 'function') {
    return;
  }

  if (callbacks.has(el)) {
    // This element is already bound. This is possible if two components, which
    // share the same root node, (i.e., one is a higher-order component
    // wrapping another) _both_ have this directive applied.
    //
    // Because Vue binds directives in the direction towards the root, only the
    // deepest instance of this directive will be bound.
    //
    // A future iteration may add support for binding all instances on a given
    // element.
    return;
  }

  if (!listening) {
    startListening();
  }

  callbacks.set(el, {
    bindTimeStamp: getEventLikeTimeStamp(),
    callback: value,
  });
};

const unbind = el => {
  callbacks.delete(el);

  if (callbacks.size === 0) {
    stopListening();
  }
};

export const OffClickDirective = {
  bind,
  unbind,
};
