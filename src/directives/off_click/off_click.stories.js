import { documentedStoriesOf } from '../../../documentation/documented_stories';
import readme from './off_click.md';
import { GlOffClickDirective } from '../../../index';

documentedStoriesOf('directives|off-click-directive', readme)
  .addParameters({ storyshots: false })
  .add('default', () => ({
    directives: {
      offClick: GlOffClickDirective,
    },
    data: () => ({
      clicks: 0,
    }),
    methods: {
      onClick() {
        this.clicks += 1;
      },
    },
    template: `<gl-button v-off-click="onClick">Clicks outside me: {{ clicks }}</gl-button>`,
  }));
