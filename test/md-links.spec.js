import {
  routeExists,
  mdOrDirectory,
  filterMdFiles,
  readFilesContent,
  extractLinks,
  verifyLinks,
  makeHTTPRequests,
  getLinkStatistics,
} from "../dist/functions.js";

//-------------------------------------------------------------------------------------------------------------------------
describe("routeExists", () => {
  it("should be a function", () => {
    expect(typeof routeExists).toBe("function");
  });

  it("should return true if the path does exist", async () => {
    expect(routeExists("./my-test-folder/file2.md")).toBe(true);
  });

  it("should throw an Error if the path does not exist", async () => {
    expect(() => routeExists("./my-test-folder/file.md")).toThrow(Error);
  });
});

//----------------------------------------------------------------------------------------------------------------------
describe("mdOrDirectory", () => {
  it("should return an array with the relative path if the input is a file", () => {
    const relativePath = "./file6.md"; // Ruta válida de un archivo MD existente
    const result = mdOrDirectory(relativePath);
    expect(result).toEqual([relativePath]);
  });

  test("should return an array of file paths if the input is a directory with MD files", () => {
    const relativePath = "./my-test-folder"; // Ruta válida de una carpeta que contiene archivos MD
    const result = mdOrDirectory(relativePath);
    const expectedFiles = [
      "my-test-folder\\file1.md",
      "my-test-folder\\file2.md",
      "my-test-folder\\subfolder1\\file3.md",
      "my-test-folder\\subfolder1\\subfolder2\\file4.md",
      "my-test-folder\\subfolder1\\subfolder2\\file5.md",
      "my-test-folder\\subfolder1\\subfolder3\\file.js",
    ];
    expect(result).toEqual(expectedFiles);
  });

  it("should return an empty array if the input is a directory without MD files", () => {
    const relativePath = ".//my-empty-folder"; // Ruta válida de una carpeta que NO contiene archivos MD
    const result = mdOrDirectory(relativePath);
    expect(result).toEqual([]);
  });
});

//-----------------------------------------------------------------------------------------------------------------------------
describe("filterMdFiles", () => {
  it('should return an empty array if there are no files with ".md" extension', () => {
    const files = ["./file1.txt", "./file2.js", "./file3.png"];
    const result = filterMdFiles(files);
    expect(result).toEqual([]);
  });

  it('should return an array with the ".md" files if they exist', () => {
    const filesMd = [
      "./file1.txt",
      "./file2.md",
      "./subfolder/file3.md",
      "./file4.js",
    ];
    const result = filterMdFiles(filesMd);
    const expectedFiles = ["./file2.md", "./subfolder/file3.md"];
    expect(result).toEqual(expectedFiles);
  });
});

//-----------------------------------------------------------------------------------------------------------------------
describe("readFilesContent", () => {
  it("should read the content of a single file", async () => {
    const file = "./my-test-folder/file2.md"; // Ruta válida de un archivo MD existente
    const result = await readFilesContent([file]);
    const expectedContent = `[Ejemplo](https://www.ejemplo.com)`;
    expect(result).toEqual([expectedContent]);
  });

  it("should read the content of multiple files", async () => {
    const files = [
      "./my-test-folder/subfolder1/subfolder2/file4.md",
      "./my-test-folder/file2.md",
    ]; // Rutas válidas de archivos MD existentes
    const result = await readFilesContent(files);
    const expectedContent = [
      `- [Empezando con Jest - Documentación oficial](https://jestjs.io/docs/es-ES/getting-started)`,
      `[Ejemplo](https://www.ejemplo.com)`,
    ];
    expect(result).toEqual(expectedContent);
  });
});

//--------------------------------------------------------------------------------------------------------------------------------
describe("extractLinks", () => {
  it("should return an empty array if there are not links", () => {
    const textArray = [
      "Este es un archivo de ejemplo sin ningún link.",
      "Aquí no hay nada que ver.",
    ];
    const result = extractLinks(textArray);
    expect(result).toEqual([]);
  });

  it("should extract the links in the text", () => {
    const textArray = [
      "Este es un link a Google [Google](https://www.google.com).",
      "Y aquí hay otro link a Wikipedia [Wikipedia](https://www.wikipedia.org).",
    ];
    const result = extractLinks(textArray);

    expect(result).toEqual([
      "[Google](https://www.google.com)",
      "[Wikipedia](https://www.wikipedia.org)",
    ]);
  });

  it("should extract multiple links in one line", () => {
    const textArray = [
      "Estos son varios links en una sola línea [Link1](https://link1.com) [Link2](https://link2.com).",
    ];
    const result = extractLinks(textArray);

    expect(result).toEqual([
      "[Link1](https://link1.com)",
      "[Link2](https://link2.com)",
    ]);
  });
});

//--------------------------------------------------------------------------------------------------------------------------------
describe("verifyLinks", () => {
  it("should retorn an empty array if there are not valid links", () => {
    const linksArray = [
      "Este no es un link válido",
      "[Esto tampoco es un link válido]",
    ];
    const result = verifyLinks(linksArray);

    expect(result).toEqual([]);
  });

  it("should extract correctly the URL and the text of the link", () => {
    const linksArray = ["[Ejemplo](https://www.ejemplo.com)"];
    const result = verifyLinks(linksArray);

    expect(result).toEqual([
      {
        href: "https://www.ejemplo.com",
        text: "Ejemplo",
        file: "C:\\Users\\AnaLaura\\OneDrive\\Escritorio\\DEV007-md-links",
      },
    ]);
  });
});

//---------------------------------------------------------------------------------------------------------------------------
describe("makeHTTPRequests", () => {
  it("should return an array with the results of the HTTP petitions", async () => {
    const urlObjects = [
      { href: "https://www.google.com" },
      { href: "https://www.wikipedia.orgg" },
    ];
    const result = await makeHTTPRequests(urlObjects);
    // Verificar que los objetos tengan los datos de respuesta esperados
    expect(result).toEqual([
      {
        href: "https://www.google.com",
        status: 200,
        message: "OK",
      },
      {
        href: "https://www.wikipedia.orgg",
        status: 404,
        message: "FAIL ✘",
      },
    ]);
  });
});

//---------------------------------------------------------------------------------------------------------------------
describe("getLinkStatistics", () => {
  it("should return the links statistics", async () => {
    const linkObjectsArray = [
      { href: "https://www.google.com", message: "OK" },
      { href: "https://www.wikipedia.org", message: "OK" },
      { href: "https://www.example.com", message: "FAIL" },
    ];
    const result = await getLinkStatistics(linkObjectsArray, false);

    expect(result).toEqual({
      total: 3,
      unique: 3,
    });
  });

  it("Should return link statistics and count valid and broken links if shouldValidate is true", async () => {
    const linkObjectsArray = [
      { href: "https://www.google.com", message: "OK" },
      { href: "https://www.wikipedia.org", message: "OK" },
      { href: "https://www.example.com", message: "FAIL ✘" },
    ];
    const result = await getLinkStatistics(linkObjectsArray, true);

    expect(result).toEqual({
      total: 3,
      unique: 3,
      valid: 2,
      broken: 1,
    });
  });
});
