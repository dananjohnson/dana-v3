const isLive = (post) => post.date <= new Date() && !post.data.draft;

async function get(collectionApi, glob) {
  return [
    ...collectionApi.getFilteredByGlob(glob).filter(isLive)
  ].reverse();
}

async function getLatest(collectionApi, glob, limit = 10) {
  const fullCollection = await get(collectionApi, glob);
  return fullCollection.slice(0, limit);
}

module.exports = {
  notes: (collectionApi) => get(collectionApi, "./src/notes/*.md"),
  latestNotes: (collectionApi) => getLatest(collectionApi, "./src/notes/*.md"),
  screenshots: (collectionApi) => get(collectionApi, "./src/screenshots/*.md"),
};
