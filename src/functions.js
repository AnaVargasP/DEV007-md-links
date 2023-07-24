import fs from "fs";
import path from "path";
import colors from "colors";

// verificar si existe una ruta -------------------------------------------------------------
export function routeExists(relativePath) {
  // parametro
  if (fs.existsSync(relativePath)) {
    return true;
  } else {
    throw new Error(
      colors.brightRed(`La ruta especificada no existe: ${relativePath}`)
    );
  }
}

// mostrar ruta relativa y convertir a absoluta -----------------------------------------------------------------------
export const showPaths = (relativePath) => {
  if (!path.isAbsolute(relativePath)) {
    const absolutePath = path.resolve(relativePath);
    console.log(
      colors.brightBlue("Ruta relativa:"),
      colors.brightBlue(relativePath)
    );
    console.log(
      colors.brightGreen("Ruta absoluta:"),
      colors.brightGreen(absolutePath)
    );
  } else {
    console.log(
      colors.brightGreen("La ruta es absoluta:"),
      colors.brightGreen(relativePath)
    );
  }
};

// verificar si es un archivo Md o es una carpeta?----------------------------------------------

export function mdOrDirectory(relativePath) {
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
}
