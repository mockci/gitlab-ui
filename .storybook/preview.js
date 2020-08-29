import { addParameters, addDecorator } from '@storybook/vue';
import { withA11y } from '@storybook/addon-a11y';

const stylesheetsRequireCtx = require.context('../src/scss', true, /(storybook|bootstrap)\.scss$/);

if (!process.env.IS_GITLAB_INTEGRATION_TEST) {
  stylesheetsRequireCtx('./bootstrap.scss');
}

stylesheetsRequireCtx('./storybook.scss');

function addSbClass(c, a) {
  return {
    template: `<div id="${a.id}" class="sb-story"><story/></div>`,
  };
}

addDecorator(addSbClass);
addDecorator(withA11y);

addParameters({
  docs: { inlineStories: true },
  a11y: {
    element: '.story-container',
  },
  viewport: {
    viewports: {
      breakpointSmall: {
        name: 'Breakpoint small (width: 320px)',
        styles: {
          height: '568px',
          width: '320px',
        },
      },
      breakpointMedium: {
        name: 'Breakpoint medium (width: 768px)',
        styles: {
          height: '1024px',
          width: '768px',
        },
      },
      breakpointLarge: {
        name: 'Breakpoint large (width: 1024px)',
        styles: {
          height: '768px',
          width: '1024px',
        },
      },
      breakpointExtraLarge: {
        name: 'Breakpoint extra large (width: 1280px)',
        styles: {
          height: '800px',
          width: '1280px',
        },
      },
    },
  },
});
