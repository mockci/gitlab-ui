<script>
import SeriesLabel from '../../charts/series_label/series_label.vue';

export default {
  components: {
    SeriesLabel,
  },
  props: {
    tooltipContent: {
      type: Object,
      required: true,
    },
  },
};
</script>
<template>
  <div>
    <div
      v-for="(value, label) in tooltipContent"
      :key="`${label}${value.value}`"
      class="gl-charts-tooltip-default-format-series"
    >
      <series-label :color="value.color" class="gl-charts-tooltip-default-format-series-label">
        {{ label }}
      </series-label>
      <div class="gl-charts-tooltip-default-format-series-value">
        {{ value.value }}
      </div>
    </div>
  </div>
</template>
