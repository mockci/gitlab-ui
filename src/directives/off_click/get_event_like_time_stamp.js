/**
 * The logic of this file is copied nearly verbatim from Vue's scheduler code:
 * https://github.com/vuejs/vue/blob/v2.6.12/src/core/observer/scheduler.js#L44-L66
 */

/**
 * Get a current timestamp that can be meaningfully compared to an event's
 * `timeStamp` property.
 *
 * Event timestamps can be implemented in one of two ways:
 *  - a DOMHighResTimeStamp representing the number of milliseconds since the
 *    beginnging of the current document's lifetime (e.g., In newer browsers)
 *  - a DOMTimeStamp representing the of milliseconds since the UNIX epoch
 *    (e.g., In jsdom, and older browsers)
 *
 * This function will return a current timestamp of the same type used by the
 * underlying environment when it creates DOM events.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp for
 * more details.
 *
 * @returns {number}
 */
let getEventLikeTimeStamp = Date.now;

const { performance } = window;

if (
  typeof performance?.now === 'function' &&
  getEventLikeTimeStamp() > document.createEvent('Event').timeStamp
) {
  // if the event timestamp, although evaluated AFTER the Date.now(), is
  // smaller than it, it means the event is using a hi-res timestamp,
  // and we need to use the hi-res version for event listener timestamps as
  // well.
  getEventLikeTimeStamp = () => performance.now();
}

export { getEventLikeTimeStamp };
