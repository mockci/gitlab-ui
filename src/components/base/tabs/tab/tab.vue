<script>
import { BTab } from 'bootstrap-vue';
import { isString, isArray, isPlainObject } from 'lodash';

export default {
  components: {
    BTab,
  },
  inheritAttrs: false,
  props: {
    titleLinkClass: {
      type: [String, Array, Object],
      required: false,
      default: null,
    },
  },
  computed: {
    linkClass() {
      const { titleLinkClass } = this;
      const defaultClass = 'gl-tab-nav-item';

      if (isString(titleLinkClass)) {
        return `${titleLinkClass} ${defaultClass}`;
      }
      if (isArray(titleLinkClass)) {
        return [...titleLinkClass, defaultClass];
      }
      if (isPlainObject(titleLinkClass)) {
        return { ...titleLinkClass, [defaultClass]: true };
      }
      return defaultClass;
    },
  },
};
</script>
<template>
  <b-tab :title-link-class="linkClass" v-bind="$attrs" v-on="$listeners">
    <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot"></slot>
  </b-tab>
</template>
