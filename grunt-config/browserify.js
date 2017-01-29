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
      "build/stage/perf-cascade.js": ["src/ts/main.ts"],
    }
  },
  fileReader: {
    files: {
      "build/stage/temp/perf-cascade-file-reader.js": ["src/ts/file-reader.ts"],
    },
    options: {
      browserifyOptions: {
        standalone: "perfCascadeFileReader"
      }
    }
  }
};
