const fs = require('fs');
const path = require('path');
const registerRequireContextHook = require('babel-plugin-require-context-hook/register');

registerRequireContextHook();

const SRC_DIR = '../src';
const storiesRequireContext = global.__requireContext(__dirname, SRC_DIR, true, /\.stories\.js$/);
const docsRequireCtx = global.__requireContext(__dirname, SRC_DIR, true, /documentation\.js$/);

const testableStories = (process.env.IS_GITLAB_INTEGRATION_TEST
  ? docsRequireCtx.keys().reduce((acc, key) => {
      const docFileContents = fs.readFileSync(path.join(__dirname, SRC_DIR, key));
      if (/followsDesignSystem: *true/.test(docFileContents)) {
        acc.push(key.replace('documentation', 'stories'));
      }
      return acc;
    }, [])
  : storiesRequireContext.keys()
).map(storyPath => path.join(SRC_DIR, storyPath));

module.exports = {
  stories: testableStories,
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport/register',
    'storybook-readme',
    './.storybook/gitlab-css-addon/register',
  ],
};
