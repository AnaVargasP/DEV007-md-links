var _require = require('./functions.js'),
  showPaths = _require.showPaths;
var mdLinks = function mdLinks() {
  var relativePath = process.argv[2];
  showPaths(relativePath);
};
mdLinks();