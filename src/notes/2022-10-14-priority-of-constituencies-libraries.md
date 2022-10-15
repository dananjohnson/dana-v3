---
title: "Priority of constituencies; or, one way to evaluate a library"
tags:
  - tools
  - libraries
  - priority of constituencies
  - developer experience
  - DX
---

When evaluating a library or framework for possible adoption, the [“priority of constituencies”](https://www.w3.org/TR/html-design-principles/#priority-of-constituencies) principle can be one useful frame. That’s the one from the [HTML]{.sc} Working Group that states:
> In case of conflict, consider users over authors over implementors over specifiers over theoretical purity.

The purpose of basically all frontend libraries is to make the developer’s life easier. Some gap exists between the intention and the actual implementation of the Web platform, and a library comes along that tries to fill it. (I’m riffing off of [Dmitri Glazkov](https://glazkov.com/2022/02/23/the-cost-of-opinion/) here.) This is all well and good—paving the cowpaths and whatnot—but a library created to impact the developer’s experience will invariably, whether directly or not, be felt by the user. And the more opinonated the tool, the more negative that impact is likely to be. That effect can come in the form of larger bundle sizes, more security vulnerabilities, or diminished reliability due to increased complexity.

I see [many](https://tailwindcss.com/) [frontend](https://emotion.sh/docs/introduction) [libraries](https://nextjs.org/) that generate a ton of buzz for their [DX]{.sc} either be silent on the issue of [UX]{.sc} or suggest that their incredible [DX]{.sc} will have [trickle-down benefits for users](https://infrequently.org/2018/09/the-developer-experience-bait-and-switch/). It’s important to be honest about who these tools are primarily for: developers. There is nothing inherently wrong with that fact. The priority of constituencies principle doesn’t say that [DX]{.sc} is unimportant. It only states that the experience of the user matters more.

So if you’re trying out a new library or framework, take a hard look at what its impact on users will be. Is there actual benefit? Is the impact at least net neutral? Don’t assess based on the author’s word alone. (But do try to gauge where the author’s priorities are at; you’re going for a long ride with them, aren’t you?) And maybe choose something that’s [not too opinionated](https://glazkov.com/2022/02/23/the-cost-of-opinion/). Your users (and your future self) will thank you.