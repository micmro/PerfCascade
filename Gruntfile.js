module.exports = function (grunt) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  var banner = "/*PerfCascade build:<%= grunt.template.today(\"dd/mm/yyyy\") %> */\n";

  grunt.initConfig({
    clean: {
      dist: ["temp/", "src/dist/"],
      pages: ["gh-pages/"],
      js: ["src/ts/**/*.js", "src/ts/**/*.js.map"]
    },
    concat: {
      dist: {
        src: ["src/css-raw/normalize.css", "src/css-raw/page.css", "src/css-raw/main.css"],
        dest: "src/dist/perf-cascade-full.css",
      },
      pages: {
        src: ["src/css-raw/normalize.css", "src/css-raw/gh-page.css", "src/css-raw/main.css"],
        dest: "src/dist/perf-cascade-gh-page.css",
      }

    },
    browserify: {
      options: {
        plugin: [['tsify']],
        banner: banner,
        browserifyOptions: {
          standalone: "perfCascade"
        }
      },
      dist: {
        files: {
          "src/dist/perf-cascade.js": ["src/ts/main.ts"],
        }
      }
    },
    tslint: {
      options: {
        // can be a configuration object or a filepath to tslint.json
        configuration: "tslint.json"
      },
      files: {
        src: [
          "src/ts/**/*.ts"
        ]
      }
    },
    uglify: {
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
          "src/dist/perf-cascade.min.js": ["src/dist/perf-cascade.js"],
          "src/dist/example.min.js": ["src/dist/example.js"]
        }
      }
    },
    watch: {
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
        tasks: ["concat:dist"],
        options: {
          spawn: false,
          interrupt: true
        },
      }
    },
    copy: {
      pages: {
        expand: true,
        flatten: true,
        src: ["src/dist/perf-cascade-gh-page.css", "src/dist/perf-cascade.min.js"],
        dest: "gh-pages/src/",
        filter: "isFile",
      },
    },
    "gh-pages": {
      options: {
        base: "gh-pages",
        add: true
      },
      src: ["**/*"]
    },
  });

  grunt.registerTask("distBase", ["clean:dist", "browserify:dist", "concat:dist"]);
  grunt.registerTask("dist", ["tslint", "distBase", "uglify:dist"]);
  grunt.registerTask("ghPages", ["clean:pages", "dist", "concat:pages", "copy:pages", "gh-pages"]);

  grunt.registerTask("default", ["distBase", "watch"]);
};