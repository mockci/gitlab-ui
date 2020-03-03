/* eslint-disable no-console */
import path from 'path';
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import puppeteer from 'puppeteer';
import { getResetAnimationsCSS } from './test_utils';

registerRequireContextHook();

// subsets of stories (i.e. story kinds) that should be excluded form visual testing
// a story kind is defined by the first part of the story's name, everything before the first pipe
// e.g. `base|avatar` -> base, `directives|resize-observer-directive` -> directives
// more information: https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#storykindregex
const excludedStoryKinds = ['directives'];

const beforeScreenshot = async page => {
  // Reset SVG animations
  await page.evaluate(() => {
    document.querySelectorAll('animate').forEach(el => {
      el.setAttribute('repeatCount', 'indefinite');
      el.setAttribute('dur', 'indefinite');
    });
  });

  // Fixing the Animation by inlining, previous approach with external file was flaky for the animation
  page.addStyleTag({
    content: getResetAnimationsCSS(),
  });
};

const getGotoOptions = () => ({
  waitUntil: 'networkidle0',
});

const failureThreshold =
  'FAILURE_THRESHOLD' in process.env ? parseFloat(process.env.FAILURE_THRESHOLD) : 0;

const browserName = process.env.PUPPETEER_BROWSER || 'chrome';

const isChrome = browserName === 'chrome';
const isFirefox = browserName === 'firefox';

const customSnapshotsDir = path.join(
  __dirname,
  isChrome ? '__image_snapshots__' : `__image_snapshots_${browserName}__`
);

const getMatchOptions = () => {
  return {
    customSnapshotsDir,
    failureThreshold,
    failureThresholdType: 'percent',
  };
};

let browser;

const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

async function getCustomBrowser() {

  console.log(`Launching ${browserName} from ${executablePath}`)

  if (isChrome) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox ', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      product: 'chrome',
      executablePath,
    });
  } else if (isFirefox) {
    browser = await puppeteer.launch({
      product: 'firefox',
      executablePath,
    });
  } else {
    throw new Error(`Unknown browser ${browserName}`);
  }

  const version = await browser.version();

  console.log(`Successfully launched browser ${browserName}: ${version}`);

  return browser;
}

afterAll(async done => {
  if (browser) {
    await browser.close();
  }
  done();
}, 15000);

initStoryshots({
  suite: 'Image storyshots',
  storyKindRegex: new RegExp(`^((?!${excludedStoryKinds.join('|')}).+)`),
  test: imageSnapshot({
    storybookUrl: 'http://localhost:9001',
    beforeScreenshot,
    getGotoOptions,
    getMatchOptions,
    getCustomBrowser,
  }),
});
