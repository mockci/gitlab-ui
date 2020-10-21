import { withKnobs, select, boolean, text as textKnob } from '@storybook/addon-knobs';
import { documentedStoriesOf } from '../../../../documentation/documented_stories';
import {
  newButtonCategoryOptions,
  newDropdownVariantOptions,
  newButtonSizeOptions,
} from '../../../utils/constants';
import readme from './dropdown.md';
import {
  GlAvatar,
  GlIcon,
  GlDropdown,
  GlDropdownDivider,
  GlDropdownSectionHeader,
  GlDropdownItem,
  GlDropdownText,
  GlDropdownForm,
} from '../../../../index';

const components = {
  GlAvatar,
  GlIcon,
  GlDropdown,
  GlDropdownDivider,
  GlDropdownSectionHeader,
  GlDropdownItem,
  GlDropdownText,
  GlDropdownForm,
};

function addClass(component) {
  component.$el.querySelectorAll('.btn').forEach(el => el.classList.add('gl-button'));
}

function generateProps({
  category = newButtonCategoryOptions.primary,
  variant = newDropdownVariantOptions.default,
  size = newButtonSizeOptions.medium,
  block = false,
  icon = '',
  textSrOnly = false,
  loading = false,
  headerText = '',
} = {}) {
  const props = {
    category: {
      type: String,
      default: select('category', newButtonCategoryOptions, category),
    },
    variant: {
      type: String,
      default: select('variant', newDropdownVariantOptions, variant),
    },
    size: {
      type: String,
      default: select('size', newButtonSizeOptions, size),
    },
    block: {
      type: Boolean,
      default: boolean('block', block),
    },
    disabled: {
      type: Boolean,
      default: boolean('disabled', false),
    },
    text: {
      type: String,
      default: textKnob('text', 'Some dropdown'),
    },
    textSrOnly: {
      type: Boolean,
      default: boolean('text sr-only', textSrOnly),
    },
    icon: {
      type: String,
      default: textKnob('icon svg name', icon),
    },
    split: {
      type: Boolean,
      default: boolean('split', false),
    },
    toggleClass: {
      type: String,
      default: textKnob('toggle class', ''),
    },
    loading: {
      type: Boolean,
      default: boolean('loading', loading),
    },
    headerText: {
      type: String,
      default: textKnob('headerText', headerText),
    },
  };

  return props;
}

function wrap([template]) {
  return `
    <gl-dropdown
      ref="dropdown"
      :category="category"
      :variant="variant"
      :size="size"
      :block="block"
      :disabled="disabled"
      :text="text"
      :text-sr-only="textSrOnly"
      :icon="icon"
      :split="split"
      :toggle-class="toggleClass"
      :header-text="headerText"
      :loading="loading"
    >
      ${template}
    </gl-dropdown>`;
}

function clickDropdown(component) {
  component.$nextTick(() => component.$el.querySelector('.dropdown-toggle').click());
}

documentedStoriesOf('base|dropdown', readme)
  .addDecorator(withKnobs)
  .add('default', () => ({
    props: generateProps(),
    components,
    template: wrap`
      <gl-dropdown-item>First item</gl-dropdown-item>
      <gl-dropdown-item>Second item</gl-dropdown-item>
      <gl-dropdown-item>Third item</gl-dropdown-item>
      <gl-dropdown-item>Fourth item</gl-dropdown-item>
      <gl-dropdown-item>Fifth item</gl-dropdown-item>
      <gl-dropdown-item>Sixth item</gl-dropdown-item>
      <gl-dropdown-item>Seventh item</gl-dropdown-item>
      <gl-dropdown-item>Eighth item</gl-dropdown-item>
      <gl-dropdown-item>Ninth item</gl-dropdown-item>
      <gl-dropdown-item>Tenth item</gl-dropdown-item>
      <gl-dropdown-item>Eleventh item</gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('secondary', () => ({
    props: generateProps({
      category: newButtonCategoryOptions.secondary,
      variant: newDropdownVariantOptions.success,
    }),
    components,
    template: wrap`
      <gl-dropdown-item>First item</gl-dropdown-item>
      <gl-dropdown-item>Second item</gl-dropdown-item>
      <gl-dropdown-item>Third item</gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('with form', () => ({
    props: generateProps(),
    components,
    template: wrap`
      <gl-dropdown-form>
        <gl-button>One</gl-button>
        <gl-button>Two</gl-button>
        <gl-button>Three</gl-button>
      </gl-dropdown-form>`,
    mounted() {
      clickDropdown(this);
    },
  }))
  .add('with divider', () => ({
    props: generateProps(),
    components,
    template: wrap`
      <gl-dropdown-item>First item</gl-dropdown-item>
      <gl-dropdown-item>Second item</gl-dropdown-item>
      <gl-dropdown-divider />
      <gl-dropdown-item>Third item</gl-dropdown-item>
      <gl-dropdown-item>Fourth item</gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('with header', () => ({
    props: generateProps({ headerText: 'Header' }),
    components,
    template: wrap`
      <gl-search-box-by-type />
      <gl-dropdown-item>First item</gl-dropdown-item>
      <gl-dropdown-item>Second item</gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('with section header', () => ({
    props: generateProps(),
    components,
    template: wrap`
      <gl-dropdown-section-header>Header title</gl-dropdown-section-header>
      <gl-dropdown-item>First item</gl-dropdown-item>
      <gl-dropdown-item>Second item</gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('with checked items', () => ({
    props: generateProps(),
    components,
    template: wrap`
      <gl-dropdown-item :is-check-item="true" :is-checked="true">Checked item</gl-dropdown-item>
      <gl-dropdown-item :is-check-item="true">Unchecked item</gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('with avatar and secondary text', () => ({
    props: generateProps(),
    components,
    template: wrap`
      <gl-dropdown-item
        avatar-url="https://secure.gravatar.com/avatar/78b060780d36f51a6763ac9831a4f022?s=180&d=identicon"
        secondary-text="@sytses"
      >
        Sid Sijbrandij
      </gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('with icons', () => ({
    props: generateProps(),
    components,
    template: wrap`
      <gl-dropdown-item
        icon-color="info"
        icon-name="status_running"
        icon-right-name="retry"
      >
        Status running
      </gl-dropdown-item>
      <gl-dropdown-item
        icon-color="success"
        icon-name="status_success"
        icon-right-name="cancel"
      >
        Status success
      </gl-dropdown-item>
      <gl-dropdown-item
        icon-color="warning"
        icon-name="status_warning"
        icon-right-name="cancel"
      >
        Status warning
      </gl-dropdown-item>
      <gl-dropdown-item
        icon-color="danger"
        icon-name="status_failed"
        icon-right-name="cancel"
      >
        Status failed
      </gl-dropdown-item>
      <gl-dropdown-item
        icon-name="status_manual"
        icon-right-name="cancel"
      >
        Status manual
      </gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('full width', () => ({
    props: generateProps({ block: true }),
    components,
    template: wrap`
      <gl-dropdown-item>First item</gl-dropdown-item>
      <gl-dropdown-item>Second item</gl-dropdown-item>
      <gl-dropdown-item>Last item</gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('with short text and wide width', () => ({
    props: generateProps(),
    components,
    template: `
      <gl-dropdown
        text="Some dropdown"
        :category="category"
        :variant="variant"
        :size="size"
        :block="block"
        :disabled="disabled"
        style="width: 300px;"
      >
        <gl-dropdown-item>First item</gl-dropdown-item>
        <gl-dropdown-item>Last item</gl-dropdown-item>
      </gl-dropdown>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('with long text and narrow width', () => ({
    props: generateProps({ block: true }),
    components,
    template: `
      <gl-dropdown
        text="Truncated text dropdown"
        :category="category"
        :variant="variant"
        :size="size"
        :block="block"
        :disabled="disabled"
        style="width: 160px;"
      >
        <gl-dropdown-item>First item</gl-dropdown-item>
        <gl-dropdown-item>Last item</gl-dropdown-item>
      </gl-dropdown>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('with item text that does not wrap', () => ({
    props: generateProps(),
    components,
    template: wrap`
      <gl-dropdown-item icon-right-name="star">Normal item</gl-dropdown-item>
      <gl-dropdown-item icon-right-name="star">
        <div class="gl-text-truncate">ellipsis/should/truncate/this/item</div>
      </gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('icon only', () => ({
    props: generateProps({ icon: 'ellipsis_v', textSrOnly: true }),
    components,
    template: wrap`
      <gl-dropdown-item>First item</gl-dropdown-item>
      <gl-dropdown-item>Second item</gl-dropdown-item>
      <gl-dropdown-item>Last item</gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }))
  .add('with loading state', () => ({
    props: generateProps({ loading: true }),
    components,
    template: wrap`
      <gl-dropdown-item>First item</gl-dropdown-item>
      <gl-dropdown-item>Last item</gl-dropdown-item>`,
    mounted() {
      clickDropdown(this);
    },
    updated() {
      addClass(this);
    },
  }));
