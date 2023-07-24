const { showPaths } = require('./functions.js');


const mdLinks = () => {
  const relativePath = process.argv[2];
  showPaths(relativePath);
};

mdLinks();
