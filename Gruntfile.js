const path = require("path");
const process = require("process");
const gruntBump = require("grunt-bump")
/**
 * @param  {IGrunt} grunt - Grunt instance
 */
module.exports = function (grunt) {
  "use strict";

  /** Version banner for static files (keep version format for "grunt-bump") */
  const banner = "/*! github.com/micmro/PerfCascade Version:<%= package.version %> <%= grunt.template.today(\"(dd/mm/yyyy)\") %> */\n";
  let releaseIncrement = ["major", "minor"]
    .indexOf(grunt.option('release-increment')) != -1 ? grunt.option('release-increment') : "patch";

  // manually load custom task
  require("./build-utils/grunt-tasks/changelog-custom")(grunt)

  // automatically loads configurations from `./grunt-config/*`
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'build-utils/grunt-config'),
    /* data made availabe to the tasks */
    data: {
      banner: banner,
      releaseIncrement: releaseIncrement
    },
  });

  /*
   * Helper Tasks
   */
  //build for the file reader
  grunt.registerTask("distFileReader", ["browserify:fileReader", "concat:fileReader"]);
  // builds the TS into a single file
  grunt.registerTask("distBase", ["clean:dist", "browserify:dist", "concat:demoCss", "distFileReader"]);

  // builds npm package - relies on /stage to be populated
  grunt.registerTask("buildNpm", ["copy:npmDist", "run:tscEs6", "copy:npmBase", "copy:npmZipLib"])

  // Post build work, copying and combining files for NPM and regular release
  grunt.registerTask("releasePrep", ["concat:mainCss", "uglify:dist", "copy:release"])

  // build a single file and a library of ES6 Modules for the NPM package
  grunt.registerTask("releaseBuild", ["distBase", "releasePrep", "buildNpm", "concat:pages", "copy:pages"]);

  // All checks and cleanup
  grunt.registerTask("preBuild", ["tslint", "clean:all"]);

  // publish components (TODO: run in parallel)
  grunt.registerTask("commitAndPush", [
    "run:publishRelease",
    "bump-commit",
    "run:npmPublish",
    "gh-pages"
  ])

  /*
   * Runnable Tasks
   */
  //releases the current version on master to github-pages (gh-pages branch)
  grunt.registerTask("ghPages", ["releaseBuild", "concat:pages", "copy:pages", "gh-pages"]);

  //releases new version with auto-version bump
  grunt.registerTask("release", [
    "preBuild",
    `bump-only:${releaseIncrement}`,
    "releaseBuild",
    "changelog-custom",
    "commitAndPush"
  ]);

  grunt.registerTask("default", ["clean:all", "distBase", "watch"]);
};