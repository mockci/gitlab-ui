<script>
export default {
  data: () => ({
    clicks: 0,
  }),
  methods: {
    onClick() {
      this.clicks += 1;
    },
  },
  template: `
    `,
};
</script>

<template>
  <gl-button v-gl-off-click="onClick">Click outside me: {{ clicks }}</gl-button>
</template>
