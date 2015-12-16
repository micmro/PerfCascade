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
    browserify: {
      options: {
        transform: [
          ["babelify", {
             presets:"es2015"
          }]
        ],
        banner: banner
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
        banner: banner
      },
      dist: {
        files: {
          "src/js-dist/har-har-har.min.js": ["src/js-dist/har-har-har.js"]
        }
      }
    },
    watch: {
      babel: {
        files: ["src/js-raw/**/*.js", "Gruntfile.js"],
        tasks: ["distBase"],
        options: {
          // spawn: false,
          interrupt: true
        },
      }
    }
  });

  grunt.registerTask("distBase", ["clean", "copy:dist", "browserify:dist"]);
  grunt.registerTask("dist", ["distBase", "uglify:dist"]);
  grunt.registerTask("watchdistBase", ["distBase", "watch"]);

  grunt.registerTask("default", ["watchdistBase"]);
};