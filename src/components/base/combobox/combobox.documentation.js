import * as description from './combobox.md';
import examples from './examples';

export default {
  followsDesignSystem: true,
  description,
  examples,
  events: [
    {
      event: 'value-selected',
      description: 'Emitted when a value is selected.',
    },
  ],
};