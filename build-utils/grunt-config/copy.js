module.exports = {
  //github pages
  pages: {
    expand: true,
    flatten: true,
    src: [
      "build/stage/perf-cascade-gh-page.css",
      "build/stage/perf-cascade.min.js",
      "build/stage/perf-cascade-file-reader.min.js"
    ],
    dest: "build/gh-pages/src/",
    filter: "isFile",
  },
  //github release
  release: {
    expand: true,
    flatten: true,
    src: [
      "build/stage/perf-cascade.js",
      "build/stage/perf-cascade.min.js",
      "build/stage/perf-cascade-file-reader.js",
      "build/stage/perf-cascade-file-reader.min.js",
      "build/stage/perf-cascade.css"
    ],
    dest: "build/release/",
    filter: "isFile",
  },
  npmDist: {
    expand: true,
    flatten: true,
    src: [
      "build/stage/perf-cascade.js",
      "build/stage/perf-cascade.min.js",
      "build/stage/perf-cascade-file-reader.js",
      "build/stage/perf-cascade-file-reader.min.js",
      "build/stage/perf-cascade.css"
    ],
    dest: "build/npm/dist/",
    filter: "isFile",
  },
  npmBase: {
    expand: true,
    flatten: true,
    src: [
      "build-utils/npm-export/index.js",
      "build-utils/npm-export/index.d.ts",
      "package.json",
      ".npmrc",
      "README.md",
      "LICENSE",
    ],
    dest: "build/npm/",
    filter: "isFile",
  },
  npmZipLib: {
    expand: true,
    cwd: "src/",
    src: ["zip/**/*"],
    dest: "build/npm/lib/",
    filter: "isFile",
  }
};
