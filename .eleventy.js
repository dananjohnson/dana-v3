const path = require("path");
const markdownIt = require("markdown-it");
const markdownItAbbr = require("markdown-it-abbr");
const SyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const ErrorOverlay = require("eleventy-plugin-error-overlay");

const filters = require("./lib/filters");
const shortcodes = require("./lib/shortcodes");
const collections = require("./lib/collections");

const manifestPath = path.resolve(__dirname, "dist/assets/manifest.json");

module.exports = function (config) {
  // Filters
  config.addFilter("w3Date", filters.w3Date);
  config.addFilter("displayDate", filters.displayDate);

  // Layout aliases
  config.addLayoutAlias("page", "layouts/page.njk");
  config.addLayoutAlias("post", "layouts/post.njk");
  config.addLayoutAlias("archive", "layouts/archive.njk");

  // Shortcodes
  config.addNunjucksAsyncShortcode("webpack", shortcodes.webpack);

  // Pass-through
  config.addPassthroughCopy("src/assets/images");

  // Plugins
  config.addPlugin(SyntaxHighlight);
  config.addPlugin(ErrorOverlay);

  // Custom collections
  config.addCollection("posts", collections.posts);
  config.addCollection("notes", collections.notes);

  // Customize markdown parsing
  const markdownLib = markdownIt({}).use(markdownItAbbr);
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

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    markdownTemplateEngine: "njk",
  };
};
