import path from "path";
import colors from "colors";

// funcion para mostrar ruta -----------------------------------------------------------------------

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
