"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyLinks = exports.showPaths = exports.routeExists = exports.readFilesContent = exports.mdOrDirectory = exports.makeHTTPRequests = exports.getLinkStatistics = exports.filterMdFiles = exports.extractLinks = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _colors = _interopRequireDefault(require("colors"));
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// verificar si existe una ruta -------------------------------------------------------------
var routeExists = function routeExists(relativePath) {
  // recibe una ruta relativa como parámetro
  // y verifica si la ruta existe en el sistema de archivos.
  if (_fs["default"].existsSync(relativePath)) {
    return true;
  } else {
    throw new Error(_colors["default"].italic.brightRed("The specified path does not exist: ".concat(relativePath)));
  }
};

// mostrar ruta relativa y convertir a absoluta -----------------------------------------------------------------------
exports.routeExists = routeExists;
var showPaths = function showPaths(relativePath) {
  // Si la ruta no es absoluta (es relativa)
  if (!_path["default"].isAbsolute(relativePath)) {
    var absolutePath = _path["default"].resolve(relativePath);
    console.log(_colors["default"].italic.magenta("Routes:"));
    console.log(_colors["default"].italic.blue("➜Relative:"), _colors["default"].italic.white(relativePath));
    console.log(_colors["default"].italic.blue("➜Absolute:"), _colors["default"].italic.white(absolutePath));
    console.log("");
  } else {
    console.log(_colors["default"].italic.blue("The route is absolute:"), _colors["default"].italic.white(relativePath));
    console.log("");
  }
};

// verificar si es un archivo Md o es una carpeta?------------------------------------------------------------------------------
exports.showPaths = showPaths;
var mdOrDirectory = function mdOrDirectory(relativePath) {
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
};

// obetener los archivos con extension md -------------------------------------------------------------------------------------------
exports.mdOrDirectory = mdOrDirectory;
var filterMdFiles = function filterMdFiles(saveFiles) {
  return saveFiles.filter(function (file) {
    return _path["default"].extname(file) === ".md";
  });
};

// leer el contenido de archivos--------------------------------------------------------------------------------------
exports.filterMdFiles = filterMdFiles;
var readFilesContent = function readFilesContent(saveFiles) {
  var filePromises = [];

  // iteramos sobre la lista de archivos
  saveFiles.forEach(function (file) {
    // Agregar una Promesa para cada archivo en la matriz 'filePromises'
    filePromises.push(new Promise(function (resolve, reject) {
      // Leer el contenido del archivo especificado
      _fs["default"].readFile(file, "utf-8", function (error, data) {
        if (error) {
          // Si hay un error, rechazar la Promesa con el error
          reject(new Error("Error al leer el archivo '".concat(file, "': ").concat(error.message)));
        } else {
          // Si se leyó correctamente, resolver la Promesa con el contenido del archivo
          resolve(data);
        }
      });
    }));
  });
  // Devolver una Promesa que se resolverá con un arreglo que contiene los contenidos de todos los archivos leídos
  return Promise.all(filePromises);
};

// Obtener los links encontrados dentro del archivo Md -----------------------------------------------------------
exports.readFilesContent = readFilesContent;
var extractLinks = function extractLinks(textArray) {
  // Array para almacenar los links encontrados
  var foundLinks = [];

  // Expresión regular para encontrar los links en el texto.
  // Busca cualquier texto entre corchetes [] seguido de cualquier texto entre paréntesis ().
  var linkRegex = /\[.+?\]\(.+?\)/g;

  // Iterar sobre cada línea de texto en el array
  textArray.forEach(function (line) {
    // Buscar coincidencias de links en la línea utilizando la expresión regular
    var linkMatches = line.match(linkRegex);
    if (linkMatches) {
      // Si se encontraron links en la línea, agregarlos al array de links encontrados.
      foundLinks.push.apply(foundLinks, _toConsumableArray(linkMatches));
    }
  });

  // Devolver el array con los links encontrados en el texto.
  return foundLinks;
};

// Verificar los links en el array de links ----------------------------------------------------------
exports.extractLinks = extractLinks;
var verifyLinks = function verifyLinks(linksArray) {
  // Array para almacenar los links verificados
  var verifiedLinks = [];

  // Obtener la ruta absoluta del directorio actual
  var currentDirectory = _path["default"].resolve();

  // Iterar sobre cada link en el array de links
  linksArray.forEach(function (link) {
    // Verificar si el link coincide con la expresión regular para un link válido
    if (link.match(/\[.+?\]\(.+?\)/)) {
      // Si el link es válido, extraer la URL y el texto del link utilizando expresiones regulares
      var linkMatches = link.match(/\[(.*?)\]\((.*?)\)/);
      var linkObject = {
        href: linkMatches[2],
        // Extraer la URL del link
        text: linkMatches[1],
        // Extraer el texto del link
        file: currentDirectory // Almacenar la ruta absoluta del directorio actual como la ubicación del archivo
      };
      // Agregar el objeto del link verificado al array de links verificados
      verifiedLinks.push(linkObject);
    }
  });

  // Devolver el array con los links verificados
  return verifiedLinks;
};

// Realizar peticiones HTTP a las URLs proporcionadas -------------------------------------------------------------------
exports.verifyLinks = verifyLinks;
var makeHTTPRequests = function makeHTTPRequests(urlObjects) {
  // Array para almacenar las promesas de las peticiones HTTP
  var promiseArray = urlObjects.map(function (obj) {
    return _axios["default"].get(obj.href) // Realizar una petición GET a la URL especificada en el objeto
    .then(function (response) {
      // Si la petición es exitosa, actualizar el objeto con los datos de respuesta
      obj.status = response.status;
      obj.message = response.statusText;
      return obj;
    })["catch"](function (err) {
      // Si ocurre un error, actualizar el objeto con el mensaje de error y el estado de la respuesta, si está disponible
      obj.message = err.response ? err.response.statusText : "FAIL";
      obj.status = err.response ? err.response.status : 404; // Establecer el estado en 404 (Not Found) si no se obtiene un estado de respuesta válido
      return obj;
    });
  });

  // Devolver una promesa que resuelve con el resultado de todas las peticiones HTTP
  return Promise.all(promiseArray);
};

// Obtener estadísticas de los links -----------------------------------------------------
exports.makeHTTPRequests = makeHTTPRequests;
var getLinkStatistics = function getLinkStatistics(linkObjectsArray, shouldValidate) {
  return new Promise(function (resolve, reject) {
    // Objeto para almacenar las estadísticas de los links
    var linkStats = {
      total: linkObjectsArray.length,
      // Total de links en el array
      unique: new Set(linkObjectsArray.map(function (link) {
        return link.href;
      })).size // Total de links únicos (sin duplicados)
    };

    // Si se debe validar los links, calcular estadísticas adicionales
    if (shouldValidate) {
      // Total de links válidos (con mensaje "OK")
      linkStats.valid = linkObjectsArray.filter(function (obj) {
        return obj.message === "OK";
      }).length;

      // Total de links rotos (con mensaje "Fail")
      linkStats.broken = linkObjectsArray.filter(function (obj) {
        return obj.message === "FAIL";
      }).length;
    }

    // Resolver la promesa con las estadísticas de los links
    resolve(linkStats);
  });
};
exports.getLinkStatistics = getLinkStatistics;