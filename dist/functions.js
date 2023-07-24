"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mdOrDirectory = mdOrDirectory;
exports.routeExists = routeExists;
exports.showPaths = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _colors = _interopRequireDefault(require("colors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// verificar si existe una ruta -------------------------------------------------------------
function routeExists(relativePath) {
  // parametro
  if (_fs["default"].existsSync(relativePath)) {
    return true;
  } else {
    throw new Error(_colors["default"].brightRed("La ruta especificada no existe: ".concat(relativePath)));
  }
}

// mostrar ruta relativa y convertir a absoluta -----------------------------------------------------------------------
var showPaths = function showPaths(relativePath) {
  if (!_path["default"].isAbsolute(relativePath)) {
    var absolutePath = _path["default"].resolve(relativePath);
    console.log(_colors["default"].brightBlue("Ruta relativa:"), _colors["default"].brightBlue(relativePath));
    console.log(_colors["default"].brightGreen("Ruta absoluta:"), _colors["default"].brightGreen(absolutePath));
  } else {
    console.log(_colors["default"].brightGreen("La ruta es absoluta:"), _colors["default"].brightGreen(relativePath));
  }
};

// verificar si es un archivo Md o es una carpeta?----------------------------------------------
exports.showPaths = showPaths;
function mdOrDirectory(relativePath) {
  var saveFiles = [];
  var stats = _fs["default"].statSync(relativePath);
  if (stats.isFile()) {
    saveFiles.push(relativePath);
  } else if (stats.isDirectory()) {
    var files = _fs["default"].readdirSync(relativePath, "utf-8");
    files.forEach(function (file) {
      var newRoute = _path["default"].join(relativePath, file);
      var statsNew = _fs["default"].statSync(newRoute);
      if (statsNew.isFile()) {
        saveFiles.push(newRoute);
      } else if (statsNew.isDirectory()) {
        saveFiles = saveFiles.concat(mdOrDirectory(newRoute));
      }
    });
  }
  return saveFiles;
}