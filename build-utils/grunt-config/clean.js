module.exports = {
  all: ["build/"],
  dist: ["build/stage/"],
  //clean old files from before the build setup change
  legacy: ["dist/", "types/", "src/dist/", "lib/", "stylesheets/", "gh-pages/", "index.d.ts", "index.js"],
  //remove manual (incorrect) TS builds
  js: ["src/ts/**/*.js", "src/ts/**/*.js.map"]
};
