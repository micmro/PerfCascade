module.exports = {
  options: {
    plugin: [['tsify']],
    banner: "<%= banner %>",
    browserifyOptions: {
      standalone: "perfCascade"
    }
  },
  dist: {
    files: {
      "src/dist/perf-cascade.js": ["src/ts/main.ts"],
    }
  },
  fileReader: {
    files: {
      "src/dist/temp/perf-cascade-file-reader.js": ["src/ts/file-reader.ts"],
    },
    options: {
      browserifyOptions: {
        standalone: "perfCascadeFileReader"
      }
    }
  }
};
