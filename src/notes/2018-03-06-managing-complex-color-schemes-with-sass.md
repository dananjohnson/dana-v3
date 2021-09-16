---
title: Managing complex color schemes with Sass
---

Designing for print, as I often do, means having nearly total control over the look of each component. When the pieces of the design don’t quite fit, they can be tweaked individually to work. Each layout can be fully art-directed. This isn’t the case when building Web interfaces{% endExcerpt %}. (Or at least shouldn’t be — you could, I suppose, write CSS with properties for elements like `#my-one-of-a-kind-div-26` or `.is-four-columns-wide-and-comes-before-an-img-but-not-a-figure`.) Art direction on the Web has come a long way, but front-end development remains fundamentally a practice of defining the rules and letting the chips fall where they may. And that’s fine: it pushes us to think about design modularly, with benefits for maintenance, performance, and design coherence. And for perfectionists like myself, it releases us from endlessly pushing elements around on a page to find the perfect layout.

---

Vibrant, complex color palettes are typical of our work at Sloop, and nowhere has that been more true than with the reports we have designed for [FRIDA \| The Young Feminist Fund](https://youngfeministfund.org/) (see [here](http://www.sloopcreative.com/projects/frida-awid-report) and [here](http://www.sloopcreative.com/projects/frida-2015-annual-report)). FRIDA supports young grassroots feminist movements around the world, and we have always strived to create visuals that mirror their radical, youthful spirit. Recently we designed their [2016 annual report]({{ site.baseUrl }}/projects/frida-report.md). Our ambitions for the design were no different, only this time we were building the report digitally.

The report was to be divided into six chapters, then further divided into any number of sections per chapter. To keep things lively, and to assist with navigation, we decided to give each chapter its own tri-color scheme, with those colors taking turns playing primary, secondary, and tertiary roles between sections. The result: a balance of variation and consistency.

It’s one thing to devise the logic of this in the design phase. But how to bring it to life? I strive to keep my HTML free of design-specific classes, but maybe I could just add a `.color--primary` class where needed, then scope that color per chapter and section, as in: `#chapter-3c .color--primary {};`. However, the color scheme would touch nearly every element of the design — text, links, images, patterns, vectors — and would thus require definition for `color`, `background-color`, `border-color`, `fill`, `stroke`, and even fetching the correct `background-image` URL. Hand-coding the color scheme over and over for every chapter, section, element, and property would create unwieldy, error-prone CSS. Imagine a design so harmonious to the eye being undergirded by line after disorienting line of code.

For such a scenario, though, Sass really shines. With [SassScript](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#sassscript), [mixins](https://sass-lang.com/guide), and [placeholder selectors](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#placeholder_selectors_foo), we can define our chapter-specific palettes for each chapter, set which types of elements and properties are impacted, then tell Sass to iterate through our color scheme for each chapter section. The outputted CSS may not be exactly elegant, but we ensure that when we or anyone else needs to change a color or add a design element down the road, we can do so with peace of mind and our sanity intact.

Let’s take a closer look at how this works.

---

First, we create a mixin that takes an array of color codes and iterates through them to create a dynamic three-color scheme using the CSS pseudo-class `nth-of-type`.

```scss
@mixin alternate-colors($colors) {
  $len: length($colors);
  @each $color in $colors {
    $i: index($colors, $color);
    &:nth-of-type(#{$len}n + #{$i}) {
      $primary-color: $color;
      $secondary-color: $secondary-color; // start with default color from variables
      $tertiary-color: $tertiary-color;
      @if $i == $len {
        $secondary-color: nth($colors, 1);
      } @else {
        $secondary-color: nth($colors, $i + 1);
      }
      @if $i == $len {
        $tertiary-color: nth($colors, 2);
      }
      @elseif $i == $len - 1 {
        $tertiary-color: nth($colors, 1);
      } @else {
        $tertiary-color: nth($colors, $i + 2);
      }
    }
  }
}
```

The mixin makes available three variables: `$primary-color`, `$secondary-color`, and `$tertiary-color`. (Note that the last two must be defined somewhere above the mixin in your code. I use partials, so I recommend adding something like this to your `_variables.scss`).)

```scss
$primary-color: #000 !default;
$secondary-color: #fff !default;
$tertiary-color: #333 !default;
```

Below the loop, we create a series of placeholder selectors for whichever CSS properties we need to make available to the theming.

```scss
@mixin alternate-colors($colors) {
  $len: length($colors);
  @each $color in $colors {
    $i: index($colors, $color);
    &:nth-of-type(#{$len}n + #{$i}) {
      $primary-color: $color;
      $secondary-color: $secondary-color; // start with default color from variables
      $tertiary-color: $tertiary-color;
      @if $i == $len {
        $secondary-color: nth($colors, 1);
      } @else {
        $secondary-color: nth($colors, $i + 1);
      }
      @if $i == $len {
        $tertiary-color: nth($colors, 2);
      }
      @elseif $i == $len - 1 {
        $tertiary-color: nth($colors, 1);
      } @else {
        $tertiary-color: nth($colors, $i + 2);
      }

      // primary color elements
      %color-primary {
        color: $primary-color;
      }

      %bg-color-primary {
        background-color: $primary-color;
      }

      %fill-primary {
        fill: $primary-color;
      }

      // secondary color elements
      %color-secondary {
        color: $secondary-color;
      }

      %bg-color-secondary {
        background-color: $secondary-color;
      }

      %fill-secondary {
        fill: $secondary-color;
      }

      // tertiary color elements
      %color-tertiary {
        color: $tertiary-color;
      }

      $pattern-hex: str-slice("#{$primary-color}", 2);

      .zig-zag {
        background-image: url("patterns/zig-zag-#{$pattern-hex}.svg");
      }
    }
  }
}
```

Placeholders are powerful selectors that allow you to create styles for classes without having to generate these selectors directly in your final CSS. So you can create a placeholder like `%color-primary`, and apply it to as many classes and IDs as you like using `@extend %color-primary`. You’ll notice also that I’m also using `str-slice` and interpolation to display a pattern as `background-image` based on `$primary-color`. We just need to name our image files using the appropriate hex codes.

With our dynamic-palette-generating mixin in place, we can define our colors for each chapter. You can add as many colors as you want per chapter; the mixin will loop back to the beginning at the end of the array.

```scss
$chapter-themes: (
  chapters: (
    chapter-1: (
      color-1: #fd541d,
      color-2: #5eccb9,
      color-3: #004b8d,
      color-4: #ffb3dd,
    ),
    chapter-2: (
      color-1: #ce4a7e,
      color-2: #dda71f,
      color-3: #167a95,
      color-4: #96db2b,
    ),
    chapter-3: (
      color-1: #167a95,
      color-2: #5eccb9,
      color-3: #ce4a7e,
    ),
    chapter-4: (
      color-1: #dda71f,
      color-2: #004b8d,
      color-3: #fd541d,
    ),
  ),
);
```

You’ll see that we’ve defined our colors using Sass’s [maps](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#maps) feature. To generate our themes, we use the `@each` directive and a couple [map functions](https://sass-lang.com/documentation/Sass/Script/Functions.html#map-functions) to produce the color values for each chapter. This will be defined for the `<main>` element in our HTML (which must be ID’d accordingly).

```scss
@each $chapter in map-keys(map-get($chapter-themes, chapters)) {
  $color-palette: map-values(
    map-get(map-get($chapter-themes, chapters), $chapter)
  );

  main##{$chapter} {
  }
}
```

Since we want our color scheme to shuffle per section in each chapter, we call our mixin for that child element:

```scss
@each $chapter in map-keys(map-get($chapter-themes, chapters)) {
  $color-palette: map-values(
    map-get(map-get($chapter-themes, chapters), $chapter)
  );

  main##{$chapter} {
    .section {
      @include alternate-colors($color-palette);
    }
  }
}
```

Now, the placeholders we created in the mixin are available to use with our CSS classes!

Let’s take a look at one might proceed from here.

---

A common module in the annual report was `.fact`, a full-width black-and-white image overlaid by a solid-colored panel and a highlighted fact or metric from FRIDA’s 2016 work. We wanted the panel to appear in `$primary-color`, and the image to be tinted with `$secondary-color` using CSS’s `background-blend-mode: multiply;`. By going through the work above of setting up our mixin, color maps, and `@each` loop, all we have to do now is the following:

```scss
.fact {
  @extend %bg-color-secondary;
  // background-image: url() is inlined
  background-size: cover;
  background-blend-mode: multiply;

  &__wrapper {
    @extend %bg-color-primary;
  }
}
```

In Chapter 1, for instance, the compiled CSS would then yield something like this:

```css
.fact {
  background-size: cover;
  background-blend-mode: multiply;
}

main#chapter-1 .section:nth-of-type(4n + 2) .fact {
  background-color: #004b8d;
}

main#chapter-1 .section:nth-of-type(4n + 2) .fact__wrapper {
  background-color: #5eccb9;
}

main#chapter-1 .section:nth-of-type(4n + 3) .fact {
  background-color: #ffb3dd;
}

main#chapter-1 .section:nth-of-type(4n + 3) .fact__wrapper {
  background-color: #004b8d;
}
```

And the final product looks like this:

Notice how `$secondary-color` in the first section has become `$primary-color` in the second. The new `$secondary-color` was actually `$tertiary-color` in the first section, and — you guessed it — will become `$primary-color` in the next section of the chapter.

---

A looping color theme like the above is a subtly effective way to bring visual unity to a presentation while simultaneously demarcating smaller chunks of content. This would be a nightmare to code and maintain from scratch, but using Sass we can create a solution that is flexible and DRY. This approach may be overkill for many scenarios that a developer faces, but for times when color becomes a formidable and elaborate player in the design, Sass is a powerful ally.

---

_Check out Chapter 1 of “Powerful Patterns” [here](http://annualreport2016.youngfeministfund.org/chapter-1/) or the annual report in its entirety [here](http://annualreport2016.youngfeministfund.org/)._

_[FRIDA]: Flexibility Resources Inclusivity Diversity Action
_[HTML]: Hypertext Markup Language
_[CSS]: Cascading Style Sheets
_[ID]: Identification
_[URL]: Uniform Resource Locator
_[DRY]: Don’t Repeat Yourself
