import { configure } from '@storybook/vue';
import { setOptions } from '@storybook/addon-options';

import Vue from "vue";

// Import your custom components.
import Pagination from '../components/base/pagination.vue';
import progressBar from '../components/base/progress_bar.vue';
import modal from '../components/base/modal.vue';
import alert from '../components/base/alert.vue';

// Import your custom directives.
import vModal from '../directives/modal';
import vTooltip from '../directives/tooltip';

// Register custom components.
Vue.component('gl-pagination', Pagination);
Vue.component('gl-progress-bar', progressBar);
Vue.component('gl-modal', modal);
Vue.component('gl-alert', alert);

// Register custom directives.
Vue.directive('gl-modal', vModal);
Vue.directive('gl-tooltip', vTooltip);

function loadStories() {
  // You can require as many stories as you need.
  require('../stories/base/pagination.js');
  require('../stories/base/progress_bar');
  require('../stories/base/modal');
  require('../stories/tooltip');
  require('../stories/alert')
}

setOptions({
  name: 'gitlab-ui',
  addonPanelInRight: true,
});

configure(loadStories, module);
