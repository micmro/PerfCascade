module.exports = {
  options: {
    banner: "<%= banner %>"
  },
  demoCss: {
    src: ["src/css-raw/normalize.css", "src/css-raw/page.css", "src/css-raw/perf-cascade.css"],
    dest: "build/stage/perf-cascade-demo.css",
  },
  mainCss: {
    src: ["src/css-raw/perf-cascade.css"],
    dest: "build/stage/perf-cascade.css",
  },
  fileReader: {
    src: ["src/zip/zip.js", "src/zip/inflate.js", "build/stage/temp/perf-cascade-file-reader.js"],
    dest: "build/stage/perf-cascade-file-reader.js",
  },
  pages: {
    src: ["src/css-raw/normalize.css", "src/css-raw/gh-page.css", "src/css-raw/perf-cascade.css"],
    dest: "build/stage/perf-cascade-gh-page.css",
  }
};
