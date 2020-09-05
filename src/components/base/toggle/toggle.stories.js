import { withKnobs, boolean } from '@storybook/addon-knobs/vue';
import GlToggle from './toggle.vue';
import mdx from './toggle.mdx';

const components = {
  GlToggle,
};

export default {
  title: 'base|toggle',
  component: GlToggle,
  decorators: [withKnobs],
  parameters: {
    docs: { page: mdx },
  },
};

export const Default = () => ({
  components,
  data() {
    return {
      toggleTrue: true,
      toggleTrue1: true,
    };
  },
  props: {
    disabled: {
      default: boolean('Disabled', false),
    },
    isLoading: {
      default: boolean('Is loading', false),
    },
  },
  template: `
    <div class="gl-font-base">
      <gl-toggle
        label="Label"
        help="Help text."
        v-model="toggleTrue"
        :disabled="disabled"
        :is-loading="isLoading"
      />
      <br>
      <gl-toggle
        label="Label"
        label-position="left"
        v-model="toggleTrue1"
        :disabled="disabled"
        :is-loading="isLoading"
      />
    </div>
  `,
});
