// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const path = require("path");
const fs = require("fs");

const downloadDirectory = path.join(__dirname, "..", "downloads");

const getLastDownloadFilePath = (dirPath) => {
  const filesOrdered = fs
    .readdirSync(dirPath)
    .map((entry) => path.join(dirPath, entry))
    .filter((entryWithPath) => fs.lstatSync(entryWithPath).isFile())
    .map((fileName) => ({ fileName, mtime: fs.lstatSync(fileName).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  return filesOrdered.length ? filesOrdered[0].fileName : false;
};

const hasFile = (dirPath, ms) => {
  const delay = 10;
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      return reject(new Error(`Could not find file in ${dirPath}`));
    }
    const found = getLastDownloadFilePath(dirPath);
    if (found) {
      return resolve(found);
    }
    setTimeout(() => {
      hasFile(dirPath, ms - delay).then(resolve, reject);
    }, delay);
  });
};

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    isExistFile(dirPath, ms = 4000) {
      console.log(`looking for file in ${dirPath}`, dirPath, ms);
      return hasFile(dirPath, ms);
    },
  });

  return config;
};
