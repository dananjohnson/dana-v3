const w3DateFilter = require('./src/filters/w3-date.js');
const displayDateFilter = require('./src/filters/display-date.js');

module.exports = function(config) {
  // Filters
  config.addFilter("w3Date", w3DateFilter);
  config.addFilter("displayDate", displayDateFilter);

  // Layout aliases
  config.addLayoutAlias('page', 'layouts/page.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');
  config.addLayoutAlias('archive', 'layouts/archive.njk');

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
