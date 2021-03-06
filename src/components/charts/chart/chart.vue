<script>
import echarts from 'echarts';
import theme, { themeName } from '../../../utils/charts/theme';
import { defaultHeight, validRenderers } from '../../../utils/charts/config';

export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
    /**
     * Warning: this prop is deprecated and will soon be removed
     * Please do not utilize `disableTheme` for formatting
     * Use the `options` prop to set desired echarts formatting
     */
    disableTheme: {
      type: Boolean,
      required: false,
      default: false,
    },
    width: {
      type: Number,
      required: false,
      default: null,
    },
    height: {
      type: Number,
      required: false,
      default: null,
    },
    groupId: {
      type: String,
      required: false,
      default: '',
    },
    renderer: {
      type: String,
      required: false,
      default: 'svg',
      validator(renderer) {
        return validRenderers.includes(renderer);
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    options() {
      this.draw();
    },
    width() {
      this.setChartSize();
    },
    height() {
      this.setChartSize();
    },
  },
  created() {
    if (!this.disableTheme) {
      echarts.registerTheme(themeName, theme);
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart, this.disableTheme ? null : themeName, {
      renderer: this.renderer,
    });
    if (this.groupId.length) {
      this.chart.group = this.groupId;
      echarts.connect(this.groupId);
    }
    this.chart.on('click', this.clickHandler);
    this.$emit('created', this.chart);
    this.draw();
    this.setChartSize();
  },
  beforeDestroy() {
    this.chart.off('click', this.clickHandler);
  },
  methods: {
    draw() {
      this.chart.setOption(this.options);
      this.$emit('updated', this.chart);
    },
    setChartSize() {
      this.chart.resize({
        width: this.width || 'auto',
        height: this.height || defaultHeight,
      });
    },
    clickHandler(params) {
      this.$emit('chartItemClicked', { chart: this.chart, params });
    },
  },
};
</script>

<template>
  <div ref="chart"></div>
</template>
