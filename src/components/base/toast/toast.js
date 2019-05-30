import { ToastPlugin } from 'bootstrap-vue';

const DEFAULT_OPTIONS = {
  autoHideDelay: 5000,
  toastClass: 'gl-toast',
  position: 'bottom-left',
};

const getToastOptions = opts => {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const { position, ...toastOptions } = options;
  toastOptions.toaster = `b-toaster-${position}`;
  return toastOptions;
};

/**
 * Note: This is not a typical Vue component and needs to be registered before instantiating a Vue app.
 * Once registered, the toast will be globally available throughout your app.
 *
 * See https://gitlab-org.gitlab.io/gitlab-ui/ for detailed documentation.
 */
export default {
  install(Vue) {
    Vue.use(ToastPlugin);

    Vue.mixin({
      beforeCreate() {
        if (this.$toast) {
          return;
        }
        this.$toast = {
          show: (message, options = {}) => {
            const renderTitle = () => {
              if (!options.action) {
                return null;
              }
              const h = this.$createElement;
              return h(
                'button',
                {
                  class: ['action', 'ripple'],
                  on: {
                    click: options.action.onClick,
                  },
                },
                options.action.text
              );
            };

            this.$bvToast.toast(message, {
              ...getToastOptions(options),
              title: renderTitle(),
            });
          },
        };
      },
    });
  },
};
