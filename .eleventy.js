const path = require("path");
const markdownIt = require("markdown-it");
const markdownItBracketedSpans = require("markdown-it-bracketed-spans");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItFootnote = require("markdown-it-footnote");
const SyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const ErrorOverlay = require("eleventy-plugin-error-overlay");
const Rss = require("@11ty/eleventy-plugin-rss");

const filters = require("./lib/filters");
const shortcodes = require("./lib/shortcodes");
const collections = require("./lib/collections");

const manifestPath = path.resolve(__dirname, "dist/assets/manifest.json");

module.exports = function (config) {
  // Filters
  config.addFilter("w3Date", filters.w3Date);
  config.addFilter("displayDate", filters.displayDate);

  // Layout aliases
  config.addLayoutAlias("base", "layouts/base.njk");
  config.addLayoutAlias("page", "layouts/page.njk");
  config.addLayoutAlias("post", "layouts/post.njk");
  config.addLayoutAlias("index", "layouts/index.njk");
  config.addLayoutAlias("home", "layouts/home.njk");

  // Shortcodes
  config.addNunjucksAsyncShortcode("webpack", shortcodes.webpack);
  config.addNunjucksAsyncShortcode("image", shortcodes.image);

  // Plugins
  config.addPlugin(SyntaxHighlight);
  config.addPlugin(ErrorOverlay);
  config.addPlugin(Rss);

  // Custom collections
  config.addCollection("notes", collections.notes);
  config.addCollection("latestNotes", collections.latestNotes);
  config.addCollection("screenshots", collections.screenshots);

  // Markdown config
  const mdOptions = {
    html: true,
    typographer: true,
  };
  const attrsOptions = {
    allowedAttributes: ["id", "class"],
  };
  const markdownLib = markdownIt(mdOptions)
    .use(markdownItBracketedSpans)
    .use(markdownItAttrs, attrsOptions)
    .use(markdownItFootnote);

  config.setLibrary("md", markdownLib);

  // Browsersync config
  config.setBrowserSyncConfig({
    ...config.browserSyncConfig,
    // Reload when manifest file changes
    files: [manifestPath],
    // Speed/clean up build time
    ui: false,
    ghostMode: false,
  });

  // Frontmatter
  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "{% endExcerpt %}",
    excerpt_alias: "excerpt",
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    markdownTemplateEngine: "njk",
  };
};
