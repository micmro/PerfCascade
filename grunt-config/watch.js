module.exports = {
  ts: {
    files: ["src/ts/**/*.ts", "Gruntfile.js"],
    tasks: ["distBase"],
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
