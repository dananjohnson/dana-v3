const isLive = (post) => post.date <= new Date() && !post.data.draft;

async function get(collectionApi, glob) {
  return [
    ...collectionApi.getFilteredByGlob(glob).filter(isLive)
  ].reverse();
}

module.exports = {
  posts: (collectionApi) => get(collectionApi, "./src/posts/*.md"),
  notes: (collectionApi) => get(collectionApi, "./src/notes/*.md"),
  screenshots: (collectionApi) => get(collectionApi, "./src/screenshots/*.md"),
};
