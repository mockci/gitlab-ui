import { documentedStoriesOf } from '../../../../documentation/documented_stories';
import readme from './tooltip_on_truncate.md';
import GlTooltipOnTruncate from './tooltip_on_truncate.vue';

const components = {
  GlTooltipOnTruncate,
};

const defaultProps = {};

function giveProps(props = {}) {
  return {
    ...defaultProps,
    ...props,
  };
}

documentedStoriesOf('utilities|tooltip_on_truncate', readme)
  .add('default', () => ({
    components,
    props: giveProps(),
    data: () => ({}),
    mounted() {
      setTimeout(() => {
        console.log('STO')
        document.querySelector('#foo').focus();
      })
    },
    template: `        
        <gl-tooltip-on-truncate title="lorem-ipsum-dolar-sit-amit-consectur-adipiscing-elit-sed-do" 
                                truncate-target="child">
          <a href="#" id="foo"
             style="white-space: nowrap; overflow:hidden; display: inline-block; max-width: 50px; border: 1px solid black;"
          >lorem-ipsum-dolar-sit-amit-consectur-adipiscing-elit-sed-do</a>
        </gl-tooltip-on-truncate>
    `,
  }));
