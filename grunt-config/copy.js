module.exports = {
  pages: {
    expand: true,
    flatten: true,
    src: [
      "src/dist/perf-cascade-gh-page.css",
      "src/dist/perf-cascade.min.js",
      "src/dist/perf-cascade-file-reader.min.js"
    ],
    dest: "gh-pages/src/",
    filter: "isFile",
  },
  npm: {
    expand: true,
    flatten: true,
    src: [
      "src/dist/perf-cascade.js",
      "src/dist/perf-cascade.min.js",
      "src/dist/perf-cascade-file-reader.js",
      "src/dist/perf-cascade-file-reader.min.js",
      "src/dist/perf-cascade.css"
    ],
    dest: "dist/",
    filter: "isFile",
  },
  npmBase: {
    expand: true,
    flatten: true,
    src: ["npm-export/index.js", "npm-export/index.d.ts"],
    dest: "./",
    filter: "isFile",
  },
  npmZipLib: {
    expand: true,
    cwd: "src/",
    src: ["zip/**/*"],
    dest: "./lib/",
    filter: "isFile",
  },
  npmTypings: {
    expand: true,
    cwd: "src/ts/",
    src: ["**/*.d.ts"],
    dest: "./types",
    filter: "isFile",
  }
};
