var path = require('path');
var colors = require('colors');

// funcion para mostrar ruta -----------------------------------------------------------------------

var showPaths = function showPaths(relativePath) {
  if (!path.isAbsolute(relativePath)) {
    var absolutePath = path.resolve(relativePath);
    console.log(colors.brightBlue('Ruta relativa:'), colors.brightBlue(relativePath));
    console.log(colors.brightGreen('Ruta absoluta:'), colors.brightGreen(absolutePath));
  } else {
    console.log(colors.brightGreen('La ruta es absoluta:'), colors.brightGreen(relativePath));
  }
};
module.exports = {
  showPaths: showPaths
};