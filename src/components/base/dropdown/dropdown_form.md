Unlike `b-dropdown-form`, we do _not_ add any additional padding with the `gl-dropdown-form` component.
This is to prevent double padding with `gl-dropdown-item` and similar components, so in most cases shouldn't be
needed. To add padding, either add a padding utility class to your form, or an inner element with some padding.
