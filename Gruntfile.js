const path = require("path");
const process = require("process");
const gruntBump = require("grunt-bump")

module.exports = function (grunt) {
  "use strict";


  /** Version banner for static files (keep version format for "grunt-bump") */
  const banner = "/*! github.com/micmro/PerfCascade Version:<%= package.version %> <%= grunt.template.today(\"(dd/mm/yyyy)\") %> */\n";
  let releaseIncrement = ["major", "minor"]
    .indexOf(grunt.option('release-increment')) != -1 ? grunt.option('release-increment') : "patch";

  // automatically loads configurations from `./grunt-config/*`
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'grunt-config'),
    /* data made availabe to the tasks */
    data: {
      banner: banner,
      releaseIncrement: releaseIncrement
    },
  });

  //build for the file reader
  grunt.registerTask("distFileReader", ["browserify:fileReader", "concat:fileReader"]);
  // builds the TS into a single file
  grunt.registerTask("distBase", ["clean:dist", "browserify:dist", "concat:demoCss", "distFileReader"]);

  //builds npm package - relies on /stage to be populated
  grunt.registerTask("buildNpm", ["copy:npmDist", "run:tscEs6", "copy:npmBase", "copy:npmZipLib"])

  //Post build work, copying and combining files for NPM and regular release
  grunt.registerTask("releasePrep", ["concat:mainCss", "uglify:dist", "copy:release"])
  //build a single file and a library of ES6 Modules for the NPM package
  grunt.registerTask("releaseBuild", ["distBase", "releasePrep", "buildNpm", "concat:pages", "copy:pages"]);
  //
  grunt.registerTask("preBuild", ["tslint", "clean:all"]);

  //releases the current version on master to github-pages (gh-pages branch)
  grunt.registerTask("ghPages", ["releaseBuild", "concat:pages", "copy:pages"/*, "gh-pages"*/]);

  //releases master and gh-pages at the same time (with auto-version bump)
  grunt.registerTask("release", ["preBuild", "bump:minor", "releaseBuild" /*"release-it:repo"*/, /*"concat:pages", "copy:pages", "gh-pages",*/ "run:npmPublish"]);
  // grunt.registerTask("release", ["release-it:repo"])

  grunt.registerTask("default", ["clean:all", "distBase", "watch"]);
};