module.exports = {
  //to test run: grunt bump --dry-run
  options: {
    files: [
      "package.json",
      "src/dist/*.js",
      "src/dist/*.css",
      "lib/perf-cascade.js",
      "lib/perf-cascade-file-reader.js",
      "lib/perf-cascade.css",
    ],
    updateConfigs: ['package'],
    commit: true,
    push: true,
    createTag: true,
    // dryRun: true,
    commitFiles: [
      "package.json",
      "src/dist/*.js",
      "src/dist/*.css",
    ],
  }
};
