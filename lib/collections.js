const isLive = (post) => post.date <= new Date() && !post.data.draft;

module.exports = {
  posts: (collection) => {
    return [
      ...collection.getFilteredByGlob("./src/posts/*.md").filter(isLive),
    ].reverse();
  },
  notes: (collection) => {
    return [
      ...collection.getFilteredByGlob("./src/notes/*.md").filter(isLive),
    ].reverse();
  },
};
