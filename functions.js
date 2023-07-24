import path from 'path';

// funcion para mostrar ruta -----------------------------------------------------------------------
const showPaths = (relativePath) => {
  if (!path.isAbsolute(relativePath)) {
    const absolutePath = path.resolve(relativePath);
    console.log('Ruta relativa:', relativePath);
    console.log('Ruta absoluta:', absolutePath);
  } else {
    console.log('La ruta es absoluta:', relativePath);
  }
};

export { showPaths };
