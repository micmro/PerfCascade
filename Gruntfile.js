const path = require("path");
const process= require("process");

module.exports = function (grunt) {
  "use strict";

  /** Version banner for static files (keep version format for "grunt-bump") */
  let banner = "/*! github.com/micmro/PerfCascade Version:<%= package.version %> <%= grunt.template.today(\"(dd/mm/yyyy)\") %> */\n";

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'grunt-config'),
    data: {
      banner: banner
      // test: false
    },
  });

  //build for the file reader
  grunt.registerTask("distFileReader", ["browserify:fileReader", "concat:fileReader"]);
  // builds the TS into a single file
  grunt.registerTask("distBase", ["clean:dist", "browserify:dist", "concat:demoCss", "distFileReader"]);

  //Post build work, copying and combining files for NPM and regular release
  grunt.registerTask("releasePrep", ["concat:mainCss", "uglify:dist", "copy:npm", "copy:npmBase", "copy:npmTypings", "copy:npmZipLib"])
  //build a single file and a library of ES6 Modules for the NPM package
  grunt.registerTask("releaseBuild", ["tslint", "clean:lib", "run:tscEs6", "distBase", "releasePrep"]);


  //releases the current version on master to github-pages (gh-pages branch)
  grunt.registerTask("ghPages", ["clean:pages", "releaseBuild", "concat:pages", "copy:pages", "gh-pages"]);

  //releases master and gh-pages at the same time (with auto-version bump)
  grunt.registerTask("release", ["clean:pages", "releaseBuild", "bump", "concat:pages", "copy:pages", "gh-pages", "run:publish"]);

  grunt.registerTask("default", ["distBase", "watch"]);
};