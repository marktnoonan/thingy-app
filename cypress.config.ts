/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "6tj242",
  fixturesFolder: "tests/e2e/fixtures",
  screenshotsFolder: "tests/e2e/screenshots",
  videosFolder: "tests/e2e/videos",

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./tests/e2e/plugins/index.js")(on, config);
    },
    specPattern: "tests/e2e/specs/**/*.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:8080",
    supportFile: "tests/e2e/support/index.js",
  },

  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack",
    },
    viewportHeight: 1000,
    viewportWidth: 1000
  },
});
