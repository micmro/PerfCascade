module.exports = {
  options: {
    compress: {
      global_defs: {
        "DEBUG": false
      },
      dead_code: true
    },
    banner: "<%= banner %>"
  },
  dist: {
    files: {
      "build/stage/perf-cascade.min.js": ["build/stage/perf-cascade.js"],
      "build/stage/perf-cascade-file-reader.min.js": ["src/zip/zip.js", "src/zip/inflate.js", "build/stage/temp/perf-cascade-file-reader.js"]
    }
  }
};
