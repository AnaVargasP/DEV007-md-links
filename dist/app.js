"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mdLinks = void 0;
var _functions = require("./functions.js");
var _colors = _interopRequireDefault(require("colors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var mdLinks = function mdLinks(document, options) {
  return new Promise(function (resolve, reject) {
    var isExists = (0, _functions.routeExists)(document);
    if (isExists) {
      (0, _functions.showPaths)(document);
      var archivos = (0, _functions.mdOrDirectory)(document);
      var filesMd = (0, _functions.filterMdFiles)(archivos);
      (0, _functions.readFilesContent)(filesMd).then(function (data) {
        var links = (0, _functions.extractLinks)(data);
        var objsLinks = (0, _functions.verifyLinks)(links);
        if (options.validate && options.stats) {
          (0, _functions.makeHTTPRequests)(objsLinks).then(function (validatedLinks) {
            (0, _functions.getLinkStatistics)(validatedLinks, options.validate).then(function (res) {
              return resolve(res);
            });
          });
        } else if (options.validate) {
          (0, _functions.makeHTTPRequests)(objsLinks).then(function (res) {
            return resolve(res);
          });
        } else if (options.stats) {
          (0, _functions.getLinkStatistics)(objsLinks, options.validate).then(function (res) {
            return resolve(res);
          });
        } else {
          resolve(objsLinks);
        }
      })["catch"](function (err) {
        reject(err);
      });
    } else {
      console.log(_colors["default"].brightRed("La ruta ingresada no existe"));
    }
  });
};
exports.mdLinks = mdLinks;