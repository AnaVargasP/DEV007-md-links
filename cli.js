const { mdLinks } = require("./dist/app");
const colors = require("colors");

const document = process.argv[2];

const isOptionValidate = process.argv.includes("--validate");
//console.log(chalk.bold.white(isOptionValidate))

const isOptionStats = process.argv.includes("--stats");
//console.log(chalk.bold.white(isOptionStats))

const options = {
  validate: isOptionValidate,
  stats: isOptionStats,
};

mdLinks(document, options)
  .then((links) => {
    if (options.validate && options.stats) {
      console.log(colors.bgCyan("Total: " + links.total));
      console.log(colors.bgCyan("Unique: " + links.unique));
      console.log(colors.bgGreen("Valid: " + links.valid));
      console.log(colors.bgRed("Broken: " + links.broken));
    } else if (options.validate) {
      links.forEach((link) => {
        console.log(colors.bgBlue("File: " + link.file));
        console.log(colors.bgBlue("Href: " + link.href));
        console.log(colors.bgBlue("Text: " + link.text));
        console.log(colors.bgBlue("Status: " + link.status));
        console.log(colors.bgBlue("Message: " + link.message));
      });
    } else if (options.stats) {
      console.log(colors.bgGreen("Total: " + links.total));
      console.log(colors.bgGreen("Unique: " + links.unique));
      console.log(colors.bgGreen("Broken: " + links.broken));
    } else {
      links.forEach((link) => {
        console.log(colors.bgCyan("File: " + link.file));
        console.log(colors.bgCyan("Href: " + link.href));
        console.log(colors.bgCyan("Text: " + link.text));
      });
    }
  })
  .catch((err) => {
    console.log(err, 22);
  });
