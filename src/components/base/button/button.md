# Button

<!-- STORY -->

Buttons execute an action, either in the background or foreground of an experience. Different button categories help guide users through certain actions. Buttons express what action will occur when the user clicks or touches it either by text, icon, or both. Additional meaning can be derived from the button variant.

## Button link

A button link is a link that is styled to look like a button, semantically speaking it's a `<a>` tag
with the necessary classes added to make it look like a button, it shares the same functionality as [`<gl-link>`]

> Note: Setting a `target` attribute without a `href` attribute, will not create any side effects. Without the presence of a `href` attribute, this component will render a `<button>`.

[`<gl-link>`]: ./?path=/story/base-link--default-link

## Label button

A label button renders a `span` styled as a button. This can be especially useful when used in a
button group, to render some text-only labels along with actionable buttons. In this case, to
improve accessibility and when applicable, consider using [`aria-labelledby`] to establish a
relationship between the label button and the associated button.

[`aria-labelledby`]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute
