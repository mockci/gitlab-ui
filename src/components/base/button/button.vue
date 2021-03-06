<script>
import { BButton } from 'bootstrap-vue';
import GlIcon from '../icon/icon.vue';
import GlLoadingIcon from '../loading_icon/loading_icon.vue';
import RelMixin from '../../mixins/rel_mixin';
import {
  newButtonCategoryOptions,
  newButtonVariantOptions,
  newButtonSizeOptions,
  newButtonSizeOptionsMap,
} from '../../../utils/constants';

export default {
  components: {
    BButton,
    GlIcon,
    GlLoadingIcon,
  },
  mixins: [RelMixin],
  props: {
    category: {
      type: String,
      required: false,
      default: newButtonCategoryOptions.primary,
      validator: value => Object.keys(newButtonCategoryOptions).includes(value),
    },
    variant: {
      type: String,
      required: false,
      default: newButtonVariantOptions.default,
      validator: value => Object.keys(newButtonVariantOptions).includes(value),
    },
    size: {
      type: String,
      required: false,
      default: newButtonSizeOptions.medium,
      validator: value => Object.keys(newButtonSizeOptions).includes(value),
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
    label: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    buttonTextClasses: {
      type: String,
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    hasIcon() {
      return this.icon !== '';
    },
    hasIconOnly() {
      return Object.keys(this.$slots).length === 0 && this.hasIcon;
    },
    isButtonDisabled() {
      return this.disabled || this.loading;
    },
    buttonClasses() {
      const classes = ['gl-button'];
      const nonCategoryVariants = [newButtonVariantOptions.dashed, newButtonVariantOptions.link];

      if (
        !nonCategoryVariants.includes(this.variant) &&
        this.category !== newButtonCategoryOptions.primary
      ) {
        classes.push(`btn-${this.variant}-${this.category}`);
      }

      classes.push({
        'btn-icon': this.hasIconOnly,
        'button-ellipsis-horizontal': this.hasIconOnly && this.icon === 'ellipsis_h',
        'btn-label': this.label,
        selected: this.selected,
      });

      return classes;
    },
    buttonSize() {
      return newButtonSizeOptionsMap[this.size];
    },
  },
};
</script>
<template>
  <b-button
    v-bind="$attrs"
    :rel="relType"
    :target="target"
    :variant="variant"
    :size="buttonSize"
    :disabled="isButtonDisabled"
    :class="buttonClasses"
    v-on="$listeners"
  >
    <gl-loading-icon v-if="loading" inline class="gl-button-icon gl-button-loading-indicator" />
    <gl-icon v-if="hasIcon && !(hasIconOnly && loading)" class="gl-button-icon" :name="icon" />
    <slot name="emoji"></slot>
    <span v-if="!hasIconOnly" :class="buttonTextClasses" class="gl-button-text"><slot></slot></span>
  </b-button>
</template>
