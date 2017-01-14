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
      "src/dist/perf-cascade.min.js": ["src/dist/perf-cascade.js"],
      "src/dist/perf-cascade-file-reader.min.js": ["src/zip/zip.js", "src/zip/inflate.js", "src/dist/temp/perf-cascade-file-reader.js"]
    }
  }
};
