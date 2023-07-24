import { routeExists, showPaths, mdOrDirectory } from "./functions.js";

const mdLinks = () => {
  const relativePath = process.argv[2];
  try {
    if (routeExists(relativePath)) {
      const files = mdOrDirectory(relativePath);
      files.forEach((file) => {
        showPaths(file); // Mostrar ruta para cada archivo encontrado
      });
    } else {
      console.error("La ruta especificada no existe.");
    }
  } catch (error) {
    console.error(error.message);
  }
};

mdLinks();
