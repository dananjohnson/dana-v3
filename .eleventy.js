const w3DateFilter = require('./src/filters/w3-date.js');
const displayDateFilter = require('./src/filters/display-date.js');
const markdownIt = require("markdown-it");
const markdownItAbbr = require("markdown-it-abbr");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(config) {
  // Filters
  config.addFilter("w3Date", w3DateFilter);
  config.addFilter("displayDate", displayDateFilter);

  // Layout aliases
  config.addLayoutAlias('page', 'layouts/page.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');
  config.addLayoutAlias('archive', 'layouts/archive.njk');

  config.addPassthroughCopy("src/assets/images");

  config.addPlugin(syntaxHighlight);

  // Customize markdown parsing
  const markdownLib = markdownIt({}).use(markdownItAbbr);
  config.setLibrary("md", markdownLib);

  // Custom collections
  const now = new Date();
  const livePosts = post => post.date <= now && !post.data.draft;
  config.addCollection('posts', collection => {
    return [
      ...collection.getFilteredByGlob('./src/posts/*.md').filter(livePosts)
    ].reverse();
  });

  return {
    dir: {
      input: "src",
      output: "dist"
    },
    markdownTemplateEngine : "njk"
  };
};
