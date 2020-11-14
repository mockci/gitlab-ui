<template>
  <div>
    <gl-button label>Label</gl-button>
    <gl-button size="small" label>Label</gl-button>
    <gl-button-group>
      <gl-button id="commit-sha-label-example" class="gl-font-monospace" label>
        b29cc44d
      </gl-button>
      <gl-button aria-describedby="commit-sha-label-example" icon="duplicate" />
      <gl-button icon="folder-open" />
    </gl-button-group>
  </div>
</template>
