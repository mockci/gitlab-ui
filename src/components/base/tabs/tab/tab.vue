<script>
import { BTab } from 'bootstrap-vue';

export default {
  components: {
    BTab,
  },
  inheritAttrs: false,
  props: {
    titleLinkClass: {
      type: [String, Array, Object],
      required: false,
      default: 'gl-tab-nav-item',
    },
  },
};
</script>
<template>
  <b-tab :title-link-class="titleLinkClass" v-bind="$attrs" v-on="$listeners">
    <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot"></slot>
  </b-tab>
</template>
