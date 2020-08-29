module.exports = api => {
  // base config for rollup
  const babelPresetEnv = ['@babel/preset-env', { modules: false, targets: { ie: 11 } }];
  const config = {
    presets: [babelPresetEnv],
    plugins: ['lodash'],
  };

  // storybook and visual regression tests
  if (api.env('storybook')) {
    babelPresetEnv[1] = { targets: { esmodules: true } };
  }

  // jest tests
  if (api.env('test')) {
    // tests are run in a node environment, not a browser
    babelPresetEnv[1] = { targets: { node: 'current' } };
    config.plugins.push('require-context-hook');
    config.plugins.push('@babel/plugin-transform-react-jsx');
  }

  return config;
};
