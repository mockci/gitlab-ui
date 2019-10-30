<script>
import GlButton from '../../base/button/button.vue';

const textBreaks = el => {
  const originalWhiteSpace = el.style.whiteSpace;
  const blockHeight = el.offsetHeight;
  el.style.whiteSpace = 'nowrap';

  const lineHeight = el.offsetHeight;
  el.style.whiteSpace = originalWhiteSpace;

  return blockHeight > lineHeight;
};

export default {
  components: {
    GlButton,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    svgPath: {
      type: String,
      required: false,
      default: null,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
    primaryButtonLink: {
      type: String,
      required: false,
      default: null,
    },
    primaryButtonText: {
      type: String,
      required: false,
      default: null,
    },
    secondaryButtonLink: {
      type: String,
      required: false,
      default: null,
    },
    secondaryButtonText: {
      type: String,
      required: false,
      default: null,
    },
    compact: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    titleBreaks: false,
    descriptionBreaks: false,
  }),
  computed: {
    fullscreen() {
      return !this.compact;
    },
    centerTitle() {
      return !this.compact && !this.titleBreaks;
    },
    centerDescription() {
      return this.centerTitle && !this.descriptionBreaks;
    },
    shouldRenderPrimaryButton() {
      return Boolean(this.primaryButtonLink && this.primaryButtonText);
    },
    shouldRenderSecondaryButton() {
      return Boolean(
        this.shouldRenderPrimaryButton && this.secondaryButtonLink && this.secondaryButtonText
      );
    },
  },
  mounted() {
    const { title, description } = this.$refs;
    this.titleBreaks = title && textBreaks(title);
    this.descriptionBreaks = description && textBreaks(description);
  },
};
</script>

<template>
  <div class="row" :class="{ 'empty-state': fullscreen }">
    <div :class="fullscreen ? 'col-12' : 'col-3 d-none d-sm-block'">
      <div v-if="svgPath" :class="{ 'svg-content': fullscreen }" class="svg-250">
        <img :src="svgPath" :alt="title" :class="{ 'mw-100': compact }" />
      </div>
    </div>
    <div :class="fullscreen ? 'col-12' : 'col-sm-9'">
      <div class="text-content">
        <h4 ref="title" :class="{ center: centerTitle, h5: compact }">{{ title }}</h4>
        <p
          v-if="description || $slots.description"
          ref="description"
          :class="{ center: centerDescription }"
        >
          <slot name="description">
            {{ description }}
          </slot>
        </p>
        <div :class="{ 'text-center': fullscreen }">
          <slot name="actions">
            <gl-button
              v-if="shouldRenderPrimaryButton"
              variant="success"
              :href="primaryButtonLink"
              >{{ primaryButtonText }}</gl-button
            >
            <gl-button
              v-if="shouldRenderSecondaryButton"
              variant="outline-success"
              :href="secondaryButtonLink"
              >{{ secondaryButtonText }}</gl-button
            >
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>