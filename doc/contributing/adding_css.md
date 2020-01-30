# Adding CSS

From GitLab 12.2 on, we are moving components styles into GitLab UI, as
described in the approved [RFC #2](https://gitlab.com/gitlab-org/frontend/rfcs/issues/2).
This approach will let us progressively decouple GitLab UI's styles from
GitLab CE's styles.

Within the components' CSS, you should include utility mixins. See
[`utility-mixins`](https://gitlab.com/gitlab-org/gitlab-ui/blob/master/scss/utility-mixins/index.scss)
for a comprehensive list of the available utilities. If what you are
looking for is not available, add it following the naming conventions
indicated in that file.

Files should be structured like this:

```plaintext
.
├── components
│   └── base
│       ├── button
│       │   ├── button.scss
│       │   ├── button.stories.js
│       │   └── button.vue
│       └── popover
│           ├── popover.scss
│           ├── popover.stories.js
│           └── popover.vue
└── assets
    ├──components.scss
    └── gitlab_ui.scss
```

Where each component's stylesheet contains its "modularized" style:

```scss
// button.scss

.gl-button {
  // style
  @include some-utility-mixin;
}
```

And the `assets/components.scss` file imports all components' stylesheets:

```scss
// components.scss

@import '../components/base/button/button';
@import '../components/base/popover/popover';
```

Within the component and when the component is integrated
into the application, you should still follow the
[`utility-first`](https://docs.gitlab.com/ce/development/fe_guide/style_guide_scss.html#utility-classes)
approach for basic layout and other styles.

See [!623](https://gitlab.com/gitlab-org/gitlab-ui/merge_requests/623)
for an example and [!624](https://gitlab.com/gitlab-org/gitlab-ui/merge_requests/624)
for the first pass implementation of silent classes. Follow along with the development
epic at [&1590](https://gitlab.com/groups/gitlab-org/-/epics/1590).

## Why are we doing it like this?

The current SCSS architecture was designed to allow us both to gain the advantages of a utility CSS approach while also applying the same styles to both Vue components here in `gitlab-ui` and HAML components in `gitlab`.

With utility-first CSS, styles are applied as a combination of single-attribute classes:

```
.flex {
  display: flex;
}

.hot-pink {
  color: $gl-pink-500
}

..

<my-component class='flex hot-pink ...' />

```

The advantages of this approach are:

- It keeps CSS file-size from growing too fast. With combinations applied in markup instead of separately named classes, new CSS usually does not need to be added.

- It clarifies which colors, sizes, and other options are available within the [design system](https://design.gitlab.com/). Rather than pulling values from specs or guessing, engineers are able to use already-vetted values. This also means that adding a new value becomes more deliberate and easier to check in reviews.

- It increases confidence that adding or removing a class will not have unintended consequences.

- It makes it easier to cascade design-system changes, especially around text and spacing. That is because the utility classes lend themselves to being updatable, like variables, in just one place. Consider the case of spacing: the values are taken from a scale (`gl-spacing-0`, `gl-spacing-10`), which means updating from a base of `4px` to `6px` means updating just those classes but keeping the relations the same.

We've decided to build both component classes and utility classes from the same mixins in order to get these benefits while also having component CSS that can be applied in `gitlab-ui` and `gitlab`, `Vue` and `HAML`, without undue or repeated effort.

For even more detail on our decision making, RFCs [#2](https://gitlab.com/gitlab-org/frontend/rfcs/issues/2) and [#4](https://gitlab.com/gitlab-org/frontend/rfcs/issues/4) contain historical discussion around these issues. After [RFC #4](https://gitlab.com/gitlab-org/frontend/rfcs/issues/4) was approved, we realized the silent class plus `@extend` approach generated large amounts of CSS and the approach was modified to use mixins and `@include` instead. For more context, see also this relevant [discussion](https://gitlab.com/gitlab-org/gitlab-ui/merge_requests/623#note_192269009).

For more information about utility-first CSS, consider [a post from Mike Crittenden](https://critter.blog/2018/06/08/in-defense-of-functional-css/), [Ollie Williams on CSS Tricks](https://css-tricks.com/growing-popularity-atomic-css/) or [Sarah Dayan's Frontstuff](https://frontstuff.io/in-defense-of-utility-first-css).

Finally, to join in on discussion about HAML components, check out the following ongoing conversations:

- [Remove outdated "Use HAML" section](https://gitlab.com/gitlab-com/www-gitlab-com/merge_requests/18894#note_212454769)
- [Change: HAML to Vue](https://gitlab.com/gitlab-org/frontend/rfcs/issues/14)

## So wait, when do I add a variable? a utility class? a component class?

**Add a variable** (in `variables.scss`) if you are setting a base value in the design system — this is rare.

**Add a component class** when writing styles that should apply to both HAML and Vue instances of a component. You may also want to use component classes when you find the same classes are being grouped together for functionality, like [`.d-flex-center`](https://gitlab.com/gitlab-org/gitlab/blob/900083d89cd6af391d26ab7922b3f64fa2839bef/app/assets/stylesheets/framework/common.scss#L425).

**Add or apply a utility class** the rest of the time.

## Other Style Questions

More answers and details can be found in the [SCSS style guide](https://docs.gitlab.com/ee/development/fe_guide/style_guide_scss.html)