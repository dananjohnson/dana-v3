const path = require("path");
const tokensPath = path.resolve(process.cwd(), "./lib/tokens.js");

module.exports = require(tokensPath)