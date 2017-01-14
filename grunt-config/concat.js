module.exports = {
  options: {
    banner: "<%= banner %>"
  },
  demoCss: {
    src: ["src/css-raw/normalize.css", "src/css-raw/page.css", "src/css-raw/perf-cascade.css"],
    dest: "src/dist/perf-cascade-demo.css",
  },
  mainCss: {
    src: ["src/css-raw/perf-cascade.css"],
    dest: "src/dist/perf-cascade.css",
  },
  fileReader: {
    src: ["src/zip/zip.js", "src/zip/inflate.js", "src/dist/temp/perf-cascade-file-reader.js"],
    dest: "src/dist/perf-cascade-file-reader.js",
  },
  pages: {
    src: ["src/css-raw/normalize.css", "src/css-raw/gh-page.css", "src/css-raw/perf-cascade.css"],
    dest: "src/dist/perf-cascade-gh-page.css",
  }
};
