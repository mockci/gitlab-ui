# Building and styling a component

A component follows the [lifecycle defined in the 
Pajamas repository](https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/blob/master/doc/component-lifecycle.md).

The following diagram outlines the steps needed to complete the build and style 
stages of a component:

```mermaid
graph TD;
A[Start] -->B[Review issue]
B--> C[Review usage guidelines and specs in Pajamas]
C--> D{New or existing component?}
D--> |New| E[Create Vue component in gitlab-ui]
E--> F[Create demos as described in Pajamas docs]
F--> G[Style component in gitlab-ui]
G-->H[Review by Product Designer]
H-->|Changes requested| G
H-->|Approved| R[Remove 'Component does not conform' warning banner from Vue tab in Pajamas]
R--> I[Review and merge by FE Maintainer]
I-->J{Pajamas needs demos or component status update?}
J-->|Yes| K[Create MR in Pajamas]
click K "https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/merge_requests/new"
K-->L[Update demos in component page]
L-->M[Set component status as built]
J-->|No| P[Grab component]
M-->O[Review and merge by FE Maintainer]
O--> P[Done]
D-->|Existing| Q[Update existing component to match new specs]
Q-->H
```

## Updating GitLab Packages

When a change to gitlab-ui is made, it will not be reflected in 
[Pajamas](https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com) until 
the package is updated. We are utilizing [Renovate GitLab Bot](https://gitlab.com/leipert-projects/renovate-gitlab-bot)
to automate this process.

Once an MR is created to bump the version, it will need to be merged by a maintainer. 
At this time, the changes should be viewable on the Pajamas site.

# Component status

Not all components within gitlab-ui are utilized within the GitLab product at this 
time. However, some components have been implemented and others have been migrated 
from [GitLab](https://gitlab.com/gitlab-org/gitlab) to [gitlab-ui](https://gitlab.com/gitlab-org/gitlab-ui). 
To view which components have been implemented into the product, view our 
[component status page](https://design.gitlab.com/components/status) within Pajamas.

## Complex components

There are a few cases where components have been migrated from GitLab to 
gitlab-ui but do not yet reflect Pajamas documentation. When a complex component 
is difficult to style or update because many features use it, a `New` version of 
the component may be created. This allows the team to build and style the component 
according to design specs without causing inadvertent side effects to features 
that are already using the migrated Vue component.

For example, see [GlButton](https://gitlab-org.gitlab.io/gitlab-ui/?path=/story/base-button--default) 
vs. [GlNewButton](https://gitlab-org.gitlab.io/gitlab-ui/?path=/story/base-new-button--default)