<script>
import echarts from 'echarts';
import { GlPopover } from '@gitlab/ui';

export default {
  components: {
    GlPopover,
  },
  inheritAttrs: false,
  props: {
    chart: {
      type: Object,
      required: true,
      validator(chart) {
        return Object.is(chart, echarts.getInstanceByDom(chart.getDom()));
      },
    },
    top: {
      type: String,
      required: false,
      default: null,
    },
    bottom: {
      type: String,
      required: false,
      default: null,
    },
    left: {
      type: String,
      required: false,
      default: null,
    },
    right: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    containerId() {
      return `${this.chart.getDom().getAttribute('_echarts_instance_')}-tooltip`;
    },
    containerPosition() {
      const props = ['top', 'bottom', 'left', 'right'];

      return props.reduce((accumulator, prop) => {
        const position = this[prop];
        if (position) {
          accumulator[prop] = position;
        }

        return accumulator;
      }, {});
    },
  },
};
</script>

<template>
  <div>
    <!--
      Width and height need to be greater than 0px for the
      popover component to render within the following container
    -->
    <div
      :id="containerId"
      :style="containerPosition"
      style="width: 1px; height: 1px"
      class="gl-chart-tooltip"
    ></div>
    <!--
      Needs to be triggered programatically using `show` property
      This is why `triggers` is currently set to an empty string
    -->
    <gl-popover v-bind="$attrs" :target="containerId" :container="containerId" triggers="">
      <slot slot="title" name="title"></slot>
      <slot></slot>
    </gl-popover>
  </div>
</template>