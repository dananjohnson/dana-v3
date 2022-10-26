---
title: "Breaking up with CSS-in-JS"
tags:
  - tools
  - libraries
  - CSS-in-JS
  - Styled Components
  - Emotion
  - developer experience
  - DX
---

I’d been working and re-working a post for some time on my falling out with [CSS]{.sc}-in-[JS]{.sc}, particularly [Emotion](https://emotion.sh/) and [Styled Components](https://styled-components.com/), but I think [this article from Sam Megura](https://dev.to/srmagura/why-were-breaking-up-wiht-css-in-js-4g9b) says nearly everything I wanted to, and with data to back up their claims. Basically the cost to users (in runtime performance) of these libraries outweighs their [DX]{.sc} benefits.

I would add one more general criticism, which is that these libraries are way too opinionated. It’s not just the wild idea of writing all your [CSS]{.sc} in [JS]{.sc} template literals. It’s that they dictate how [CSS]{.sc} is loaded in the browser (e.g. as a bunch of `<style>` tags). And that they are incompatible with established configuration and build tools like browserslist, autoprefixer, postcss, and webpack. I’ve come to much prefer the humble tool that solve one or two problems and leave others to do the rest. ([CSS]{.sc} Modules comes to mind as one example.) Such tools acknowledge implicitly that not all developers or projects have the same needs, that offramps are necessary and don’t have to be painful, and that gradual progress and consensus are preferable to moving fast and breaking things.