<template>
  <gl-paginated-list
    :list="[
      { id: 'foo' },
      { id: 'bar' },
      { id: 'baz' },
      { id: 'qux' },
      { id: 'quux' },
      { id: 'corge' },
      { id: 'grault' },
      { id: 'garply' },
      { id: 'waldo' },
      { id: 'fred' },
      { id: 'xyzzy' },
      { id: 'plugh' },
      { id: 'thud' },
    ]"
  >
    <template #header>
      <gl-deprecated-button variant="success" class="order-1">
        Foo Button
      </gl-deprecated-button>
    </template>
  </gl-paginated-list>
</template>
