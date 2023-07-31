import {
  routeExists,
  showPaths,
  mdOrDirectory,
  filterMdFiles,
  readFilesContent,
  extractLinks,
  verifyLinks,
  makeHTTPRequests,
  getLinkStatistics,
} from "./functions.js";
import colors from "colors";

export const mdLinks = (document, options) => {
  return new Promise((resolve, reject) => {
    const isExists = routeExists(document);
    if (isExists) {
      showPaths(document);
      const archivos = mdOrDirectory(document);
      const filesMd = filterMdFiles(archivos);
      if (filesMd.length === 0) {
        reject(new Error("No Markdown files found in the directory."));
        return;
      }
      readFilesContent(filesMd)
        .then((data) => {
          const links = extractLinks(data);

          if (links.length === 0) {
            reject(new Error("No links found in the files."));
            return;
          }
          const objsLinks = verifyLinks(links);

          if (options.validate && options.stats) {
            makeHTTPRequests(objsLinks).then((validatedLinks) => {
              getLinkStatistics(validatedLinks, options.validate).then((res) =>
                resolve(res)
              );
            });
          } else if (options.validate) {
            makeHTTPRequests(objsLinks).then((res) => resolve(res));
          } else if (options.stats) {
            getLinkStatistics(objsLinks, options.validate).then((res) =>
              resolve(res)
            );
          } else {
            resolve(objsLinks);
          }
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      console.log(colors.brightRed("La ruta ingresada no existe"));
    }
  });
};
