---
title: Shopify theme development & progressive enhancement
summary: >
  Progressive enhancement is an invaluable methodology often made difficult in practice by frontend tools that reduce good UX to "feeling like an app".
  In this post, I reflect on my first experience building a custom theme with Shopify, a platform which I happily discovered is built for progressive enhancement.
tags:
  - Shopify
  - progressive enhancement
  - tools
  - frameworks
---

At work, we recently launched an e-commerce website for a big Leftist book publisher. We migrated them to Shopify, and while our backend team focused on building an application to integrate the platform with their internal inventory software, distributors, and other services, I lead development on the new customer-facing site. E-commerce is not a domain we have traditionally worked in, and save for a couple simple storefronts for clients in the distant past, Shopify was basically a new platform for us. It was my first chance to become acquainted with Shopify theme development.[^1]

Being at an agency occassionally demands working in stacks and domains that are very unfamiliar, and I find that these projects are the ones that most expand my thinking and help me understand the craft of frontend development. As this project winds downs, I wanted to reflect a bit on my biggest takeaway, which was the experience of developing in a framework with a strong committment to progressive enhancement. Progressive enhancement is an invaluable methodology often made difficult to realize in practice by frontend architectures that reduce good [UX]{.sc} to "feeling like an app". A lot will always come down to the individual developer's or team's priorities, but this was the first time I had the tailwind of a framework at my back when doing progressive enhancement, and it felt amazing.

<details>
  <summary>The Shopify theme stack</summary>
  <p>A <a href="https://shopify.dev/docs/themes">Shopify theme</a> is a collection of <a href="https://shopify.dev/docs/api/liquid">Liquid</a> templates, <span class="sc">JSON</span> for theme configuration, and static <span class="sc">CSS</span> and <span class="sc">JS</span> files. The directory structure is strict: folder and file naming and organization must follow documented patterns in order for Shopify to know how to apply your theme once published. Templates can access data for store resources like products and collections, and are compiled into <span class="sc">HTML</span> on the server at request-time. In order to include a build process for static assets, we had to write <span class="sc">CSS</span> and <span class="sc">JS</span> in a separate source folder and compile them to where Shopify needed them. (A GitHub action helpfully automated this and the necessary restructuring in a release branch that could be integrated directly with the store.)</p>

```
├── config/
│   └── webpack.config.js
├── src/
│   └── css/
│   └── js/
├── shopify/
│   └── assets/
│   └── templates/
│   └── snippets/
│   └── etc
```

</details>

## Theme design principles

Shopify publishes a set of [design principles for themes](https://shopify.dev/docs/themes/best-practices#guiding-principles-for-theme-development), which I found early on in the project: "Be performant", "Be purpose-built", "Offer best-in-class [UX]{.sc}", "Be mobile first", "Be accessible", "Make customization simple". On performance, they write:

> Consider building your theme using primarily [HTML]{.sc} and [CSS]{.sc}. JavaScript shouldn't be required for the basic functionality of your theme, such as finding or purchasing products. Instead, you should only use JavaScript as a progressive enhancement, and only where there is no HTML or CSS solution available.

It's impressive to hear a platform on which users have a highly interactive experience pushing developers to make core features work without JavaScript. Jeremy Keith recently [published a call](https://adactio.com/journal/20113) for the builders of web "applications" like Google Docs to at least provide a _read-only_ experience without the need for JavaScript. So you know it's rare when you have a platform stating their committment to go further and progressively enhance _write_ functionality as well.

That's all well and good, but how exactly? Shopify publishes a starter theme called [Dawn](<(https://github.com/Shopify/dawn)>) that puts their design principles into action. We cloned this and relied on it heavily as we built our custom theme. As I engaged with Dawn and adopted its practices in our own theme, I came to see the overarching goal behind not just performance but all their principles as _robustness_. How can one build a storefront that stands up to the all the potential points of friction when it reaches your customer? Can it adapt to different device sizes? Is it understandable to assitive technologies? Can it handle a slow or intermittent network connection? Can someone still buy a product if a [CDN]{.sc} fails to deliver the site's JavaScript?

## Assumptions

In fact, these things only become points of friction if your application is too rigid. As Jeremy Keith has emphasized [many](https://adactio.com/journal/11354) [times](https://adactio.com/journal/10665) on his blog over the years, making assumptions about users and the conditions under which they'll use what your build is a trap that lurks perpetually for frontend developers. Many of us inhabit [a serious bubble of privilege](https://infrequently.org/2022/12/performance-baseline-2023/), such that, without regularly reminder, it is easy to assume that all our users also have newish MacBook Pros and high-speed internet. And even when we do remind ourselves, it's like the thing Donald Rumsfeld infamously said: there are known unknowns, and there are unknown unknowns. Relinquishing assumptions means that, on top of preparing for the situations where we expect variability, we recognize and prepare for the fact that so many things cannot be predicted in the first place. (This is why humility is one of the most important qualities of a good frontend developer.)

If unpredictibility is baked into the Web itself, we need a methodology that embraces that quality, and progressive enhancement has proven over the years to be the best approach available. I won't write a detailed articulation of what progressive enhancement is here. If you are looking for that, there are plenty of articles out there already. Instead, I'll use the more concrete case of what it looks like in the context of a Shopify theme.

## Progressive enhancement & Shopify theme development

Let's look at two different journeys:

First up is a user who has loaded this site with JavaScript disabled. What does their experiencing using the site look like? To start, they are a returning customer, so they click "Log in" and are taken to a page where they can enter their user credentials. Once authenticated, they know what book they want to buy, so they click the search icon in the header and are taken to a full-site search page. There, they search for the book they want, go to the product page for it, and click "Add to cart". They are then taken to the cart page, with that item now in their cart and an [HTML]{.sc} form to let them adjust the quantity. Finally they click "Check out" and begin the process of purchasing the book.[^2]

Now let's look at that journey again but for a user who has JavaScript enabled and for whom all [JS]{.sc} assets have downloaded, parsed, and executed without error. Upon clicking "Log in", they are shown the log-in form in a modal dialog. After authenticating, they click the search icon, which toggles a predictive search popover. As they type the title of the book they want, results are returned on the fly from the [API]{.sc}, and they see the book appear and click it. On the product page, they click "Add to cart", and another request is fired off to the [API]{.sc} that adds the book to their cart and triggers a drawer to slide in. Here they can adjust the quantity and see the total cost adjust dynamically. They aren't quite ready to check out, so they close the drawer and continue browsing.

The beauty of a progressively-enhanced approach like this is that the user without JavaScript will have no idea that they are missing out on anything. They came to the site, found what they were looking for, added it to their cart, and made their purchase. In the end, though JavaScript made the second user's experience more efficient and perhaps more enjoyable, functionally the end result was the same. In this case, JavaScript truly serves as an _enhancement_.

## So it's just about making things work without JavaScript?

I don't want to reduce progressive enhancement to "it works without JavaScript", which is often how it's casually defined. There are all sorts of small places on this site where the mindset of avoiding assumptions is brought to life: responsive layouts that rely on media queries by default but container queries in supporting browsers; interactive widgets that work equally well for keyboards and mice; animations that run only when reduced motion isn't preferred by the user. That said, [HTML]{.sc} and [CSS]{.sc} are much more resilient in nature than JavaScript, so the burden of doing progressive enhancement does fall unequally on providing core functionality without [JS]{.sc}, and then just using it to _enhance_ the user's experience.[^3]

## The progressive enhancement toolkit

Now I want to get a bit more technical and look at what progressive enhancement actually looks like in code. For us, there were four critical tools.

The first and most important tool for supporting core e-commerce functionality without JavaScript is the humble [HTML]{.sc} `<form>` element. I will admit to having adopted the common misconception in recent years that if a user is interacting with an [API]{.sc}, then of course they have to use JavaScript. But no! `<form>` was what [made the read-only web read-write 25+ years ago](https://www.wired.com/story/form-element-modern-web-mistake/), and it can still absolutely do the job.[^4] Better yet, it is optimized for layering on an enhanced experience with JavaScript, because you can script an event callback to prevent the form from submitting with [HTML]{.sc}, and make the call to your [API]{.sc} endpoint in the browser with `fetch` instead. Just make sure to prevent double submissions, and communicate state changes to assistive technologies!

Next up are custom [HTML]{.sc} elements. Custom elements are part of the [Web Components suite of APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components). They are another case where [HTML]{.sc} provides a baseline experience and JavaScript (when available) adds enhanced functionality. Here is a simplified example:

```html
<add-to-cart data-product-id="12345">
  <a href="/cart?product=12345">Add to cart</a>
</add-to-cart>
```

```js
class AddToCart extends HTMLElement {
  constructor() {
    super();

    const anchor = this.querySelector("a");
    // now you better change this <a> to make it walk and talk like a <button>.
    // but do not go messing this up! it needs a `role`, a `tabindex`,
    // and distinct click, keyup, and keydown listeners.
    // see https://adrianroselli.com/2022/04/brief-note-on-buttons-enter-and-space.html
    this.enhanceAnchorIntoButton(anchor, this.handleButtonClick);
  }

  handleButtonClick = () => {
    // maybe indicate loading state

    const { productId } = this.dataset;

    fetch("/cart-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: productId,
            quantity: 1,
          },
        ],
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // do something with the response
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        // disable your loading state
      });
  };
}

customElements.define("add-to-cart", AddToCart);
```

Without JavaScript, [HTML]{.sc} in its forgiving nature just treats `<add-to-cart>` as an element with no semantic significance, basically a `<span>`. So the anchor inside just functions as itself, taking the user to the Cart page with the necessary search parameters to add the product via a server-side request. With JavaScript present, meanwhile, this element gains superpowers. First, we give the anchor the semantics and event handlers of a button. Then, when clicked, we make a [POST]{.sc} to the Cart [API]{.sc}. The actual code also includes more robust functionality around loading, error, and error states.

The third tool is the [HTML]{.sc} `<noscript>` element for showing content in the event that JavaScript is disabled. On the Cart page, for instance, an "Update" button is put in a `<noscript>` tag that allows a no-[JS]{.sc} user to submit a form changing the quantities of items in their cart. (With [JS]{.sc} enabled, "+" and "-" buttons allow updates to be made dynamically.)

And finally there's the classic trick of putting a `.no-js` class on the `<html>` tag, then using a blocking script at the top of the page to change it to `.js` when JavaScript is available. With this technique, you have a class at the root of your document that your [CSS]{.sc} can key off of to show and hide different elements based on the presence or absence of JavaScript. It's a bit like `<noscript>` but for styles.

## Closing thoughts

While it would be nice to end this post with just a pat on the back, I want to close by noting some places in our approach where the ideal of JavaScript-less core functionlity isn't quite realized in practice. I'm talking specifically about `<noscript>` and `.no-js/.js`, and the difference between JavaScript being disabled and JavaScript failing.

We know from [a UK Digital Services study](https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/) that around 0.2% of users disable JavaScript in their browser. That's a small fraction of the users for whom JavaScript is unavailable for *any reason*. That same study and [others](https://endtimes.dev/why-your-website-should-work-without-javascript/) have put *that* number just above 1%, while [others claim](https://scribe.rip/@jason.godesky/when-javascript-fails-52eef47e90db) it's as high as 3%. So JavaScript fails much more often than it is actively disabled. Which also means that it's not 1–3 visitors out of 100 that don't have JavaScript; [it's 1-3 *visits*](https://scribe.rip/@jason.godesky/when-javascript-fails-52eef47e90db). That's not an insignifant amount of traffic. JavaScript fails for [many, many different reasons](https://www.kryogenix.org/code/browser/everyonehasjs.html), and many of these fall beyond the control of users and the developers who built the site.

But `<noscript>` and `.no-js/.js` don't know if JavaScript has failed or not. They only know if it has been _disabled_. If there is a network hiccup and first-party JavaScript stops downloading, or a browser extension interferes with the site's code, these tools won't help. That's a problem, and probably the best solution is to just know their limitations and not rely on them for things they can't do. For instance, where I described putting a form submit button inside a `<noscript>` tag above, a better solution would probably be to make that button available to _all_ users and just skip the dynamic "add" and "subtract" cart buttons. This maybe sacrifices convenience for some users but improves the site's resilience, and the form submission could still be intercepted and executed in the client when JavaScript is available.

As for `.no-js/.js`, perhaps a better solution than a top-level test would be to incorporate this kind of logic in the specific piece of functionality that is being enhanced. So we start with `.no-js` globally, but then in the [JS]{.sc} module for, say, the mobile nav menu, we make a class attribute switch that takes the nav, which is visible by default, and hides it in a drawer offscreen. Perhaps we include a `try…catch` block to switch back to no-[JS]{.sc} styles if there are any errors. Even as I'm writing this, alarms are going off in my head about waiting for a (preferably deferred) script to be downloaded, parsed, and executed before making what would be an obvious and potentially confusing presentational change. That's why the top-level `.no-js/.js` trick is blocking. I don't have a good answer here yet. Progressive enhancement in practice is hard, but I never like when practice falls short of values, so this is something I going to keep thinking about.

All that said, this project stills feels like a real success, and I am proud of the work our team did on it. A big shoutout to Shopify, too, for demonstrating what is possible when a platform makes progressive enhancement a fundamental part of their stack. In this era of novelty being confused for innovation, and complexity for craftsmanship, I think many developers and managers would look at the architecture for a Shopify theme and see it as simplistic and old-fashioned. The people demand single-page applications!, they say. My unpopular opinion is that progressive enhancement is a methodology that can actually align the interests of users, website authors, software platforms, and businesses.[^6] If you're a capitalist speaking the language of "traffic" and "conversion", getting as many users as possible to their goal, as quickly as possible, regardless of circumstances, should never go out of style.[^5] If you're a developer, "boring" technologies are your best bet for "cheating entropy", [as Jim Nielsen says](https://blog.jim-nielsen.com/2020/cheating-entropy-with-native-web-tech/). And if you're just a human being who cares about other human beings, and still believes in the Web's promise of openness and inclusivity, then there's no better approach than progressive enhancement for meeting people right where they are.

[^1]: Had we started this project a few months later, we probably would have used [Hydrogen](https://hydrogen.shopify.dev/) for the frontend, Shopify's new React-driven storefront framework. But if memory serves—this feels like ages ago now!—Hydrogen was still in beta and lacked the full set of [API]{.sc}s we needed for a store selling books in multiple global markets using different distributors. So we instead created a custom theme.
[^2]: This part of the process takes the customer out of the theme and puts them more-or-less just in Shopify's hands.
[^3]: With websites relying on larger and larger amounts of Javascript every year—a trend I hope is changing—it is all the more important to swim upstream and use [JS]{.sc} only when it's the one tool that can do the job.
[^4]: This is a good place to mention that progressive enhancement is more than just a frontend concern. While frontend developers can manage the _read_ part, _write_ powers require buy-in across the stack, in the form of endpoints that support [POST]{.sc} requests from [HTML]{.sc} `<form>` elements. I worry that many [API]{.sc}s these days only accept request bodies as [JSON]{.sc} data, which in the browser cannot be constructed without JavaScript interceding in the form submission. This is symptomatic of a more general problem in website and web application development with relying on client-side JavaScript for core functionality. Fortunately many frontend frameworks seem to be making this easier by adding better support for writing server code. In a framework like [Astro](https://astro.build/), you would add some server-side logic to your route component to check if the request for the page has a body, and if so, would execute a call to whichever [API]{.sc} there rather than doing it in the browser. This architecture is sometimes called "backend for frontend (BFF)". That said, I do think that we have a ways to go before the specter of "[SPAs]{.sc} for everything!" is gone.
[^5]: Maybe because Shopify is in the business of supporting small businesses, where every dollar counts, they actually get this.
[^6]: It just doesn't have a bunch of venture capital and "mindshare" behind it.