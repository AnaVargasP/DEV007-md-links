"use strict";

var _functions = require("./functions.js");
var mdLinks = function mdLinks() {
  var relativePath = process.argv[2];
  (0, _functions.showPaths)(relativePath);
};
mdLinks();
