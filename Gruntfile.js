module.exports = function( grunt ) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  var banner = "/*HarHarHar build:<%= grunt.template.today(\"dd/mm/yyyy\") %> */\n";

  grunt.initConfig({
    clean : ["temp/", "src/js-dist"],
    copy : {
      dist: {
        files: [{
          expand: true,
          cwd: "src/js-raw",
          src: ["**/*.js"],
          dest: "temp",
          ext: ".js"
        }]
      }
    },
    // babel: {
    //   options: {
    //     sourceMap: true,
    //     // presets: ['es2015']
    //   },
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: "temp/collect",
    //       src: ["**/*.js"],
    //       dest: "temp/es5",
    //       ext: ".js"
    //     }]
    //   }
    // },
    browserify: {
      options: {
        transform: [
          ["babelify", {
             // loose: "all"
             presets:"es2015"
             // plugins: "transform-es2015-modules-commonjs"
          }]
        ],
        banner: banner,
        // sourceType: "module",
        // plugins: [["babelify", {plugins: "transform-es2015-modules-commonjs"}]]
      },
      dist: {
        files: {
          "src/js-dist/har-har-har.js": ["temp/**/*.js"],
        }
      }
    },
    uglify : {
      options: {
        compress: {
          global_defs: {
            "DEBUG": false
          },
          dead_code: true
        },
        banner: banner,
        report: 'gzip'
      },
      dist: {
        files: {
          "src/js-dist/har-har-har.min.js": ["src/js-dist/har-har-har.js"]
        }
      }
    },
    watch: {
      babel: {
        files: ["src/js-raw/**/*", "Gruntfile.js"],
        tasks: ["dist"],
        options: {
          spawn: false,
          interrupt: true
        },
      }
    }
  });

  grunt.registerTask("dist", ["clean", "copy:dist", /*"babel",*/ "browserify:dist", "uglify:dist"]);
  grunt.registerTask("watchdist", ["dist", "watch"]);

  grunt.registerTask("default", ["watchdist"]);
};