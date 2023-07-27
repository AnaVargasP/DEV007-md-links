import fs from "fs";
import path from "path";
import colors from "colors";
import axios from "axios";

// verificar si existe una ruta -------------------------------------------------------------
export const routeExists = (relativePath) => {
  // recibe una ruta relativa como parámetro
  // y verifica si la ruta existe en el sistema de archivos.
  if (fs.existsSync(relativePath)) {
    return true;
  } else {
    throw new Error(
      colors.brightRed(`La ruta especificada no existe: ${relativePath}`)
    );
  }
};

// mostrar ruta relativa y convertir a absoluta -----------------------------------------------------------------------
export const showPaths = (relativePath) => {
  // Si la ruta no es absoluta (es relativa)
  if (!path.isAbsolute(relativePath)) {
    const absolutePath = path.resolve(relativePath);
    console.log(
      colors.bgWhite("Relative route:"),
      colors.bgWhite(relativePath)
    );
    console.log(
      colors.bgWhite("Absolute route:"),
      colors.bgWhite(absolutePath)
    );
  } else {
    console.log(
      colors.bgWhite("The route is absolute:"),
      colors.bgWhite(relativePath)
    );
  }
};

// verificar si es un archivo Md o es una carpeta?------------------------------------------------------------------------------
export const mdOrDirectory = (relativePath) => {
  let saveFiles = [];
  const stats = fs.statSync(relativePath);
  if (stats.isFile()) {
    saveFiles.push(relativePath);
  } else if (stats.isDirectory()) {
    const files = fs.readdirSync(relativePath, "utf-8");
    files.forEach((file) => {
      const newRoute = path.join(relativePath, file);
      const statsNew = fs.statSync(newRoute);
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
export const filterMdFiles = (saveFiles) => {
  return saveFiles.filter((file) => path.extname(file) === ".md");
};

// leer el contenido de archivos--------------------------------------------------------------------------------------
export const readFilesContent = (saveFiles) => {
  const filePromises = [];

  // iteramos sobre la lista de archivos
  saveFiles.forEach((file) => {
    // Agregar una Promesa para cada archivo en la matriz 'filePromises'
    filePromises.push(
      new Promise((resolve, reject) => {
        // Leer el contenido del archivo especificado
        fs.readFile(file, "utf-8", (error, data) => {
          if (error) {
            // Si hay un error, rechazar la Promesa con el error
            reject(
              new Error(`Error al leer el archivo '${file}': ${error.message}`)
            );
          } else {
            // Si se leyó correctamente, resolver la Promesa con el contenido del archivo
            resolve(data);
          }
        });
      })
    );
  });
  // Devolver una Promesa que se resolverá con un arreglo que contiene los contenidos de todos los archivos leídos
  return Promise.all(filePromises);
};

// Obtener los links encontrados dentro del archivo Md -----------------------------------------------------------
export const extractLinks = (textArray) => {
  // Array para almacenar los links encontrados
  const foundLinks = [];

  // Expresión regular para encontrar los links en el texto.
  // Busca cualquier texto entre corchetes [] seguido de cualquier texto entre paréntesis ().
  const linkRegex = /\[.+?\]\(.+?\)/g;

  // Iterar sobre cada línea de texto en el array
  textArray.forEach((line) => {
    // Buscar coincidencias de links en la línea utilizando la expresión regular
    const linkMatches = line.match(linkRegex);
    if (linkMatches) {
      // Si se encontraron links en la línea, agregarlos al array de links encontrados.
      foundLinks.push(...linkMatches);
    }
  });

  // Devolver el array con los links encontrados en el texto.
  return foundLinks;
};

// Verificar los links en el array de links ----------------------------------------------------------
export const verifyLinks = (linksArray) => {
  // Array para almacenar los links verificados
  const verifiedLinks = [];

  // Obtener la ruta absoluta del directorio actual
  const currentDirectory = path.resolve();

  // Iterar sobre cada link en el array de links
  linksArray.forEach((link) => {
    // Verificar si el link coincide con la expresión regular para un link válido
    if (link.match(/\[.+?\]\(.+?\)/)) {
      // Si el link es válido, extraer la URL y el texto del link utilizando expresiones regulares
      const linkMatches = link.match(/\[(.*?)\]\((.*?)\)/);
      const linkObject = {
        href: linkMatches[2], // Extraer la URL del link
        text: linkMatches[1], // Extraer el texto del link
        file: currentDirectory, // Almacenar la ruta absoluta del directorio actual como la ubicación del archivo
      };
      // Agregar el objeto del link verificado al array de links verificados
      verifiedLinks.push(linkObject);
    }
  });

  // Devolver el array con los links verificados
  return verifiedLinks;
};

// Realizar peticiones HTTP a las URLs proporcionadas -------------------------------------------------------------------
export const makeHTTPRequests = (urlObjects) => {
  // Array para almacenar las promesas de las peticiones HTTP
  const promiseArray = urlObjects.map((obj) => {
    return axios
      .get(obj.href) // Realizar una petición GET a la URL especificada en el objeto
      .then((response) => {
        // Si la petición es exitosa, actualizar el objeto con los datos de respuesta
        obj.status = response.status;
        obj.message = response.statusText;
        return obj;
      })
      .catch((err) => {
        // Si ocurre un error, actualizar el objeto con el mensaje de error y el estado de la respuesta, si está disponible
        obj.message = err.response ? err.response.statusText : "FAIL";
        obj.status = err.response ? err.response.status : 500; // Establecer el estado en 500 (Internal Server Error) si no se obtiene un estado de respuesta válido
        return obj;
      });
  });

  // Devolver una promesa que resuelve con el resultado de todas las peticiones HTTP
  return Promise.all(promiseArray);
};

// Obtener estadísticas de los links -----------------------------------------------------
export const getLinkStatistics = (linkObjectsArray, shouldValidate) => {
  return new Promise((resolve, reject) => {
    // Objeto para almacenar las estadísticas de los links
    const linkStats = {
      total: linkObjectsArray.length, // Total de links en el array
      unique: new Set(linkObjectsArray.map((link) => link.href)).size, // Total de links únicos (sin duplicados)
      broken: 0,
    };

    // Si se debe validar los links, calcular estadísticas adicionales
    if (shouldValidate) {
      // Total de links válidos (con mensaje "OK")
      linkStats.valid = linkObjectsArray.filter(
        (obj) => obj.message === "OK"
      ).length;

      // Total de links rotos (con mensaje "Fail")
      linkStats.broken = linkObjectsArray.filter(
        (obj) => obj.message === "FAIL"
      ).length;
    }

    // Resolver la promesa con las estadísticas de los links
    resolve(linkStats);
  });
};
