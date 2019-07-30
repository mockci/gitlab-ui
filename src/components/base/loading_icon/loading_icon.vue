<script>
const sizes = {
  sm: 'sm', // -> 16px
  md: 'md', // -> 24px
  lg: 'lg', // -> 32px
  xl: 'xl', // -> 64px
};
const sizeToStringMap = {
  1: sizes.sm,
  2: sizes.lg,
  3: sizes.lg,
  4: sizes.xl,
  5: sizes.xl,
};
const colors = {
  orange: 'orange',
  dark: 'dark',
  light: 'light',
};
const defaultSize = sizes.md;
const defaultColor = colors.orange;

const baseCssClass = 'gl-spinner';

export default {
  props: {
    label: {
      type: String,
      required: false,
      default: 'Loading',
    },
    size: {
      type: [Number, String],
      required: false,
      default: defaultSize,
      validator(value) {
        return (value > 0 && value < 6) || Object.keys(sizes).includes(value);
      },
    },
    color: {
      type: String,
      required: false,
      default: defaultColor,
      validator(value) {
        return Object.keys(colors).includes(value);
      },
    },
    inline: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    rootElementType() {
      return this.inline ? 'span' : 'div';
    },
    sizeToString() {
      return sizeToStringMap[this.size] || defaultSize;
    },
    isSizeString() {
      return Number.isNaN(parseInt(this.size, 10));
    },
    actualSize() {
      return this.isSizeString ? sizes[this.size] : this.sizeToString;
    },
    cssClasses() {
      return [
        baseCssClass,
        `${baseCssClass}-${colors[this.color]}`,
        `${baseCssClass}-${sizes[this.actualSize]}`,
      ];
    },
  },
  created() {
    if (!this.isSizeString)
      console.warn("Icon sizes 1 - 5 are deprecated, please use 'sm', 'md' and 'lg' instead."); // eslint-disable-line no-console
  },
};
</script>
<template>
  <component :is="rootElementType" class="gl-spinner-container">
    <span
      :class="cssClasses"
      class="align-text-bottom"
      :aria-label="label"
      aria-hidden="true"
    ></span>
  </component>
</template>
