import { shallowMount } from '@vue/test-utils';
import GlTooltipOnTruncate from './tooltip_on_truncate.vue';

describe('GlTooltipOnTruncate', () => {
  it('renders main components', () => {
    const wrapper = shallowMount(GlTooltipOnTruncate);
    expect(wrapper).toBeInstanceOf(Object);
  });
});
