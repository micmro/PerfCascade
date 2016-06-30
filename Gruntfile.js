module.exports = function (grunt) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  /** Version banner for static files (keep version format for "grunt-bump") */
  var banner = "/*! github.com/micmro/PerfCascade Version:<%= pkg.version %> <%= grunt.template.today(\"(dd/mm/yyyy)\") %> */\n";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ["temp/", "src/dist/"],
      pages: ["gh-pages/"],
      js: ["src/ts/**/*.js", "src/ts/**/*.js.map"]
    },
    concat: {
      options: {
        banner: banner
      },
      demoCss: {
        src: ["src/css-raw/normalize.css", "src/css-raw/page.css", "src/css-raw/perf-cascade.css"],
        dest: "src/dist/perf-cascade-demo.css",
      },
      mainCss: {
        src: ["src/css-raw/perf-cascade.css"],
        dest: "src/dist/perf-cascade.css",
      },
      fileReader: {
        src: ["src/zip/zip.js", "src/zip/inflate.js", "src/dist/temp/perf-cascade-file-reader.js"],
        dest: "src/dist/perf-cascade-file-reader.js",
      },
      pages: {
        src: ["src/css-raw/normalize.css", "src/css-raw/gh-page.css", "src/css-raw/perf-cascade.css"],
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
      },
      fileReader: {
        files: {
          "src/dist/temp/perf-cascade-file-reader.js": ["src/ts/file-reader.ts"],
        },
        options:{
          browserifyOptions: {
            standalone: "perfCascadeFileReader"
          }
        }
      }
    },
    tslint: {
      options: {
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
          "src/dist/perf-cascade-file-reader.min.js": ["src/zip/zip.js", "src/zip/inflate.js", "src/dist/temp/perf-cascade-file-reader.js"]
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
        tasks: ["concat:demoCss"],
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
      }
    },
    "gh-pages": {
      options: {
        base: "gh-pages",
        add: true,
        // tag: '<%= pkg.version %>'
      },
      src: ["**/*"]
    },
    bump: {
      //to test run: grunt bump --dry-run
      options :{
        files: [
            "package.json",
            "src/dist/perf-cascade.js",
            "src/dist/perf-cascade.min.js",
            "src/dist/perf-cascade-file-reader.js",
            "src/dist/perf-cascade-file-reader.min.js",
            "src/dist/perf-cascade-demo.css",
            "src/dist/perf-cascade.css"
        ],
        updateConfigs: ['pkg'],
        commit: true,
        push: true,
        createTag: true,
        // dryRun: true,
        commitFiles: [
            "package.json",
            "src/dist/perf-cascade.js",
            "src/dist/perf-cascade.min.js",
            "src/dist/perf-cascade-file-reader.js",
            "src/dist/perf-cascade-file-reader.min.js",
            "src/dist/perf-cascade-demo.css",
            "src/dist/perf-cascade.css"
        ],
      }
    }
  });

  grunt.registerTask("distFileReader", ["browserify:fileReader", "concat:fileReader"]);
  grunt.registerTask("distBase", ["clean:dist", "browserify:dist", "concat:demoCss", "distFileReader"]);

  //build uptimized release file
  grunt.registerTask("releaseBuild", ["tslint", "distBase", "concat:mainCss", "uglify:dist"]);

  //releases the current version on master to github-pages (gh-pages branch)
  grunt.registerTask("ghPages", ["clean:pages", "releaseBuild", "concat:pages", "copy:pages", "gh-pages"]);

  //releases master and gh-pages at the same time (with auto-version bump)
  grunt.registerTask("release", ["clean:pages", "releaseBuild", "bump", "concat:pages", "copy:pages", "gh-pages"]);

  grunt.registerTask("default", ["distBase", "watch"]);
};