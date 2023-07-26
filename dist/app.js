"use strict";

var _functions = require("./functions.js");
var mdLinks = function mdLinks() {
  var relativePath = process.argv[2];
  try {
    if ((0, _functions.routeExists)(relativePath)) {
      var files = (0, _functions.mdOrDirectory)(relativePath);
      files.forEach(function (file) {
        (0, _functions.showPaths)(file); // Mostrar ruta para cada archivo encontrado
      });
    } else {
      console.error("La ruta especificada no existe.");
    }
  } catch (error) {
    console.error(error.message);
  }
};
mdLinks();