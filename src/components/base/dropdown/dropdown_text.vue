<script>
import { BDropdownText } from 'bootstrap-vue';

export default {
  components: {
    BDropdownText,
  },
  inheritAttrs: false,
};
</script>

<template>
  <b-dropdown-text class="gl-new-dropdown-text" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </b-dropdown-text>
</template>
