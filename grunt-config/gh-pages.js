module.exports = {
  options: {
    base: "build/gh-pages",
    add: true,
    message: "Github Pages release for v<%= package.version %>"
  },
  src: ["**/*"]
}