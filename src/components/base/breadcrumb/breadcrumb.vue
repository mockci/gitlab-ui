<script>
import { BBreadcrumb, BBreadcrumbItem } from 'bootstrap-vue';

export default {
  components: {
    BBreadcrumb,
    BBreadcrumbItem,
  },
  inheritAttrs: false,
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [{ text: '', href: '' }],
      validator: links => links.every(link => Object.keys(link).includes('text', 'href')),
    },
  },
};
</script>
<template>
  <div class="gl-breadcrumbs">
    <b-breadcrumb class="gl-breadcrumb-list" v-bind="$attrs" v-on="$listeners">
      <slot name="avatar"></slot>
      <template v-for="(item, index) in items">
        <b-breadcrumb-item
          :key="index"
          class="gl-breadcrumb-item"
          :text="item.text"
          :href="item.href"
        />
        <span
          v-if="index != items.length - 1"
          :key="`index ${item.text}`"
          class="gl-breadcrumb-separator"
        >
          <slot name="separator"></slot>
        </span>
      </template>
    </b-breadcrumb>
  </div>
</template>
