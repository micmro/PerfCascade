module.exports = {
  ts: { // all ts except the file reader ones (to avoid double-reload)
    files: ["src/ts/**/*.ts", "!src/ts/file-reader.ts"],
    tasks: ["browserify:dist"],
    options: {
      spawn: false,
      interrupt: true
    },
  },
  fileReader: { //handle file-reader builds
    files: ["src/ts/file-reader.ts", "src/zip/*.js"],
    tasks: ["distFileReader"],
    options: {
      spawn: false,
      interrupt: true
    },
  },
  css: {
    files: ["src/css-raw/**/*.css"],
    tasks: ["concat:demoCss"],
    options: {
      spawn: false,
      interrupt: true
    },
  }
};
