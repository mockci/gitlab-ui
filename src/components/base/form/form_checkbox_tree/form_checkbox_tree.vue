<script>
import { Tree } from './models/tree';
import GlFormGroup from '../form_group/form_group.vue';
import GlFormCheckbox from '../form_checkbox/form_checkbox.vue';
import GlFormCheckboxTreeNode from './checkbox_tree_node.vue';
import { V_MODEL } from './models/constants';

export default {
  components: {
    GlFormGroup,
    GlFormCheckbox,
    GlFormCheckboxTreeNode,
  },
  model: {
    prop: V_MODEL.PROP,
    event: V_MODEL.EVENT,
  },
  props: {
    /**
     * Options tree where each option is in the form:
     * {
     *  value: String|Number,
     *  label: String,
     *  children: Array,
     * }
     */
    options: {
      type: Array,
      required: true,
    },
    /**
     * Selected options
     */
    value: {
      type: Array,
      required: false,
      default: () => [],
    },
    hideToggleAll: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectAllLabel: {
      type: String,
      required: false,
      default: 'Select all',
    },
    unselectAllLabel: {
      type: String,
      required: false,
      default: 'Unselect all',
    },
  },
  data() {
    return {
      tree: new Tree(this.options, this.value),
    };
  },
  computed: {
    toggleAllLabel() {
      return this.tree.allOptionsChecked ? this.unselectAllLabel : this.selectAllLabel;
    },
  },
  watch: {
    'tree.selected': {
      handler(selected) {
        this.$emit(V_MODEL.EVENT, selected);
      },
    },
  },
  provide() {
    return {
      tree: this.tree,
    };
  },
};
</script>

<template>
  <gl-form-group>
    <gl-form-checkbox
      v-if="!hideToggleAll"
      class="gl-form-checkbox-tree-toggle-all"
      :checked="tree.allOptionsChecked"
      :indeterminate="tree.someOptionsChecked"
      :aria-label="toggleAllLabel"
      @change="tree.toggleAllOptions"
    >
      {{ toggleAllLabel }}
    </gl-form-checkbox>
    <gl-form-checkbox-tree-node v-for="option in options" :key="option.value" :option="option" />
  </gl-form-group>
</template>
