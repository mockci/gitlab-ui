<script>
import { isVisible, selectAll } from 'bootstrap-vue/src/utils/dom';
import { BDropdown } from 'bootstrap-vue';
import GlIcon from '../icon/icon.vue';
import GlLoadingIcon from '../loading_icon/loading_icon.vue';
import {
  newButtonCategoryOptions,
  newDropdownVariantOptions,
  newButtonSizeOptions,
  dropdownIconSizeOptions,
} from '../../../utils/constants';
import ButtonMixin from '../../mixins/button_mixin';

// Return an Array of visible items
function filterVisible(els) {
  return (els || []).filter(isVisible);
}

const Selector = {
  ITEM_SELECTOR:
    '.dropdown-item:not(.disabled):not([disabled]),.form-control:not(.disabled):not([disabled])',
};

// see https://gitlab.com/gitlab-org/gitlab-ui/merge_requests/130#note_126406721
const ExtendedBDropdown = {
  extends: BDropdown,
  methods: {
    getItems() {
      return filterVisible(selectAll(Selector.ITEM_SELECTOR, this.$refs.menu));
    },
  },
};

export default {
  components: {
    BDropdown: ExtendedBDropdown,
    GlIcon,
    GlLoadingIcon,
  },
  mixins: [ButtonMixin],
  props: {
    headerText: {
      type: String,
      required: false,
      default: '',
    },
    text: {
      type: String,
      required: false,
      default: '',
    },
    textSrOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    split: {
      type: Boolean,
      required: false,
      default: false,
    },
    category: {
      type: String,
      required: false,
      default: newButtonCategoryOptions.tertiary,
      validator: value => Object.keys(newButtonCategoryOptions).includes(value),
    },
    variant: {
      type: String,
      required: false,
      default: newDropdownVariantOptions.default,
      validator: value => Object.keys(newDropdownVariantOptions).includes(value),
    },
    size: {
      type: String,
      required: false,
      default: newButtonSizeOptions.medium,
      validator: value => Object.keys(newButtonSizeOptions).includes(value),
    },
    icon: {
      type: String,
      required: false,
      default: null,
    },
    block: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    toggleClass: {
      type: [String, Array, Object],
      required: false,
      default: null,
    },
  },
  computed: {
    renderCaret() {
      if (this.split) {
        return false;
      }
      return true;
    },
    iconSize() {
      return this.size === newButtonSizeOptions.small
        ? dropdownIconSizeOptions[0]
        : dropdownIconSizeOptions[1];
    },
    toggleButtonClasses() {
      return [
        this.toggleClass,
        {
          'gl-button': true,
          'gl-dropdown-toggle': true,
          [`btn-${this.variant}-secondary`]:
            this.category === newButtonCategoryOptions.secondary ||
            (this.category === newButtonCategoryOptions.tertiary && this.split),
          [`btn-${this.variant}-tertiary`]:
            this.category === newButtonCategoryOptions.tertiary && !this.split,
          'dropdown-icon-only': !this.text?.length && this.icon,
          'dropdown-icon-text': this.text?.length && this.icon,
        },
      ];
    },
    splitButtonClasses() {
      return [
        this.toggleClass,
        {
          'gl-button': true,
          'split-content-button': Boolean(this.text),
          'icon-split-content-button': Boolean(this.icon),
          [`btn-${this.variant}-secondary`]:
            this.category === newButtonCategoryOptions.secondary ||
            this.category === newButtonCategoryOptions.tertiary,
        },
      ];
    },
    buttonText() {
      return this.split && this.icon ? null : this.text;
    },
  },
  methods: {
    show(...args) {
      this.$refs.dropdown.show(...args);
    },
    hide(...args) {
      this.$refs.dropdown.hide(...args);
    },
  },
};
</script>

<template>
  <b-dropdown
    ref="dropdown"
    class="gl-new-dropdown"
    v-bind="$attrs"
    :split="split"
    :variant="variant"
    :size="buttonSize"
    :toggle-class="[toggleButtonClasses]"
    :split-class="splitButtonClasses"
    :block="block"
    :disabled="disabled || loading"
    v-on="$listeners"
  >
    <p v-if="headerText" class="gl-new-dropdown-header-top">{{ headerText }}</p>
    <slot></slot>
    <slot slot="button-content" name="button-content">
      <gl-loading-icon v-if="loading" class="gl-mr-2" />
      <gl-icon v-if="icon" class="dropdown-icon" :name="icon" :size="iconSize" aria-hidden="true" />
      <span class="gl-new-dropdown-button-text" :class="{ 'gl-sr-only': textSrOnly }">{{
        buttonText
      }}</span>
      <gl-icon
        v-if="renderCaret"
        class="gl-button-icon dropdown-chevron"
        name="chevron-down"
        aria-hidden="true"
      />
    </slot>
  </b-dropdown>
</template>
