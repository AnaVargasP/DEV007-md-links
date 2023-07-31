#!/usr/bin/env node

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
      console.log(colors.italic.magenta("Statistics and Validated links:"));
      console.log(
        colors.italic.blue("   Total: "),
        colors.italic.white(links.total)
      );
      console.log(
        colors.italic.blue("   Unique: "),
        colors.italic.white(links.unique)
      );
      console.log(
        colors.italic.blue("   Valid: "),
        colors.italic.white(links.valid)
      );
      console.log(
        colors.italic.blue("   Broken: "),
        colors.italic.white(links.broken)
      );
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      // si solo usan validate-------------------------------------------
    } else if (options.validate) {
      console.log(colors.italic.magenta("Validated links:"));

      links.forEach((link) => {
        console.log(
          colors.italic.blue("   File: "),
          colors.italic.white(link.file)
        );
        console.log(
          colors.italic.blue("   Href: "),
          colors.italic.white(link.href)
        );
        console.log(
          colors.italic.blue("   Text: "),
          colors.italic.white(link.text)
        );
        console.log(
          colors.italic.blue("   Status: "),
          colors.italic.white(link.status)
        );
        console.log(
          colors.italic.blue("   Message: "),
          colors.italic.white(link.message)
        );
        console.log(colors.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
      });
      // si solo usan stats-------------------------------------------------------
    } else if (options.stats) {
      console.log(colors.italic.magenta("File statistics:"));
      console.log(
        colors.italic.blue("   Total: "),
        colors.italic.white(links.total)
      );
      console.log(
        colors.italic.blue("   Unique: "),
        colors.italic.white(links.unique)
      );
      console.log(colors.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    } else {
      // si solo usan el path---------------------------------------------------
      console.log(colors.italic.magenta("Found links:"));
      links.forEach((link) => {
        console.log(
          colors.italic.blue("   File:"),
          colors.italic.white(link.file)
        );
        console.log(
          colors.italic.blue("   Href:"),
          colors.italic.white(link.href)
        );
        console.log(
          colors.italic.blue("   Text:"),
          colors.italic.white(link.text)
        );
        console.log(colors.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
      });
    }
  })
  .catch((err) => {
    console.error(
      colors.brightRed(
        colors.italic.brightRed("An unexpected error occurred", err.message)
      )
    );
  });
