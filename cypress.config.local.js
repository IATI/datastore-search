const { defineConfig } = require("cypress");
const path = require("path");
const fs = require("fs");

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

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    fixturesFolder: "cypress/fixtures",
    specPattern: "cypress/integration/*.spec.js",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    supportFile: "cypress/support/index.js",
    setupNodeEvents(on, config) {
      on("task", {
        isExistFile(dirPath, ms = 4000) {
          console.log(`looking for file in ${dirPath}`, dirPath, ms);
          return hasFile(dirPath, ms);
        },
      });

      return config;
    },
  },
});
