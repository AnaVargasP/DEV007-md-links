import { showPaths } from "./functions.js";

const mdLinks = () => {
  const relativePath = process.argv[2];
  showPaths(relativePath);
};

mdLinks();
