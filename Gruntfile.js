module.exports = function( grunt ) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  var banner = "/*PerfCascade build:<%= grunt.template.today(\"dd/mm/yyyy\") %> */\n";

  grunt.initConfig({
    clean : {
      dist: ["temp/", "src/js-dist"],
      js: ["src/ts/**/*.js", "src/ts/**/*.js.map"]
    },
    browserify: {
      options: {
        plugin: [['tsify']],
        banner: banner
      },
      dist: {
        files: {
          "src/js-dist/perf-cascade.js": ["src/ts/main.ts"],
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
          "src/js-dist/perf-cascade.min.js": ["src/js-dist/perf-cascade.js"]
        }
      }
    },
    watch: {
      babel: {
        files: ["src/ts/**/*.ts", "Gruntfile.js"],
        tasks: ["distBase"],
        options: {
          spawn: false,
          interrupt: true
        },
      }
    }
  });

  grunt.registerTask("distBase", ["clean:dist", "browserify:dist"]);
  grunt.registerTask("dist", ["distBase", "uglify:dist"]);

  grunt.registerTask("default", ["distBase", "watch"]);
};