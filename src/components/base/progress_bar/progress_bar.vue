<script>
import { BProgress } from 'bootstrap-vue';

export default {
  components: {
    BProgress,
  },
};
</script>

<template>
  <b-progress v-bind="$attrs" />
</template>
