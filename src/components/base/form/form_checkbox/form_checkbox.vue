<script>
import { BFormCheckbox } from 'bootstrap-vue';

export default {
  name: 'GlFormCheckbox',
  components: {
    BFormCheckbox,
  },
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'input',
  },
};
</script>

<template>
  <b-form-checkbox
    plain
    v-bind="$attrs"
    class="gl-form-checkbox"
    @change="$emit('change', $event)"
    @input="$emit('input', $event)"
  >
    <slot></slot>
    <p v-if="Boolean($scopedSlots.help)" class="help-text">
      <slot name="help"></slot>
    </p>
  </b-form-checkbox>
</template>
