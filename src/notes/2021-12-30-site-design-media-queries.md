---
title: "Site design: Media queries"
tags:
  - media queries
  - intrinsic web design
  - site design
---

One thing I wanted to try with this site was to build it without any media queries. (Specifically, without ones testing viewport size.) Binding layout to screen dimensions is usually an anti-pattern, and in 2021 it’s more-often-than-not just unnecessary. ([Jen Simmons](https://www.youtube.com/watch?v=jBwBACbRuGY), [Andy Bell, and Heydon Pickering](https://every-layout.dev/) demonstrate these points beautifully.)

I didn’t *quite* succeed. The header bar occupied too much of the screen on small devices as a sticky container, so I positioned it statically under such conditions. But that’s it. Otherwise, this site rearranges and scales elements based on just a few suggestions I’ve passed to the browser via `display: flex; flex-wrap: wrap;` and `clamp()`. 😊