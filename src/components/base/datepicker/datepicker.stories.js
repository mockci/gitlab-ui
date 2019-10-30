import { withKnobs, date } from '@storybook/addon-knobs/dist/deprecated';
import documentedStoriesOf from '../../../utils/documented_stories';
import readme from './datepicker.md';
import GlDatepicker from './datepicker.vue';

const currentYear = new Date().getFullYear();

const defaultDate = new Date(currentYear, 0, 15);
const defaultMinDate = new Date(currentYear, 0, 1);
const defaultMaxDate = new Date(currentYear, 2, 31);

function dateTypeKnob(name, defaultValue) {
  return new Date(date(name, defaultValue));
}

function generateProps() {
  return {
    minDate: {
      type: Date,
      default: dateTypeKnob('minDate', defaultMinDate),
    },
    maxDate: {
      type: Date,
      default: dateTypeKnob('maxDate', defaultMaxDate),
    },
  };
}

documentedStoriesOf('base|datepicker', readme)
  .addDecorator(withKnobs)
  .add('default', () => ({
    props: generateProps(),
    components: {
      GlDatepicker,
    },
    data() {
      return {
        value: defaultDate,
      };
    },
    template: `
      <gl-datepicker :max-date="maxDate" :min-date="minDate" :start-opened="true" v-model="value">
      </gl-datepicker>
    `,
  }))
  .add('custom trigger', () => ({
    props: generateProps(),
    components: {
      GlDatepicker,
    },
    data() {
      return {
        value: null,
      };
    },
    template: `
      <div>
        <div class="dropdown">
          <button type="button" class="dropdown-menu-toggle">
            <span class="dropdown-toggle-text"> Start date: {{value}} </span>
            <i class="fa fa-chevron-down" aria-hidden="true"> </i>
          </button>
        </div>
        <gl-datepicker v-model="value" target=".dropdown-menu-toggle" />
      </div>
    `,
  }));