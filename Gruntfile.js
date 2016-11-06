module.exports = function (grunt) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  /** Version banner for static files (keep version format for "grunt-bump") */
  var banner = "/*! github.com/micmro/PerfCascade Version:<%= pkg.version %> <%= grunt.template.today(\"(dd/mm/yyyy)\") %> */\n";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ["temp/", "src/dist/", "./index.js", "./index.d.ts"],
      pages: ["gh-pages/"],
      lib: ["lib/", "types/", "./index.js", "./index.d.ts"],
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
        options: {
          browserifyOptions: {
            standalone: "perfCascadeFileReader"
          }
        }
      }
    },
    run: {
      options: {
        failOnError: true
      },
      //run typescrip compiler directly since all tools don't support latest flags
      tscEs6: {
        cmd: 'npm',
        args: 'run tsc -- src/ts/main.ts src/ts/file-reader.ts --outDir ./lib/ --module es6 --declaration --declarationDir ./types'.split(' ')
      },
      publish: {
        cmd: 'npm',
        args: ['publish']
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
        src: [
          "src/dist/perf-cascade-gh-page.css",
          "src/dist/perf-cascade.min.js",
          "src/dist/perf-cascade-file-reader.min.js"
        ],
        dest: "gh-pages/src/",
        filter: "isFile",
        },
      npm: {
        expand: true,
        flatten: true,
        src: [
          "src/dist/perf-cascade.js",
          "src/dist/perf-cascade.min.js",
          "src/dist/perf-cascade-file-reader.js",
          "src/dist/perf-cascade-file-reader.min.js",
          "src/dist/perf-cascade.css"
        ],
        dest: "dist/",
        filter: "isFile",
      },
      npmBase: {
        expand: true,
        flatten: true,
        src: ["npm-export/index.js", "npm-export/index.d.ts"],
        dest: "./",
        filter: "isFile",
      },
      npmZipLib: {
        expand: true,
        cwd: "src/",
        src: ["zip/**/*"],
        dest: "./lib/",
        filter: "isFile",
      },
      npmTypings: {
        expand: true,
        cwd: "src/ts/",
        src: ["**/*.d.ts"],
        dest: "./types",
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
      options: {
        files: [
          "package.json",
          "src/dist/perf-cascade.js",
          "src/dist/perf-cascade.min.js",
          "src/dist/perf-cascade-file-reader.js",
          "src/dist/perf-cascade-file-reader.min.js",
          "src/dist/perf-cascade-demo.css",
          "src/dist/perf-cascade.css",
          "lib/perf-cascade.js",
          "lib/perf-cascade-file-reader.js",
          "lib/perf-cascade.css",
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

  //build for the file reader
  grunt.registerTask("distFileReader", ["browserify:fileReader", "concat:fileReader"]);
  // builds the TS into a single file
  grunt.registerTask("distBase", ["clean:dist", "browserify:dist", "concat:demoCss", "distFileReader"]);

  //Post build work, copying and combining files for NPM and regular release
  grunt.registerTask("releasePrep", ["concat:mainCss", "uglify:dist", "copy:npm", "copy:npmBase", "copy:npmTypings", "copy:npmZipLib"])
  //build a single file and a library of ES6 Modules for the NPM package
  grunt.registerTask("npmRelease", ["tslint", "clean:lib", "run:tscEs6", "distBase", "releasePrep"]);


  //releases the current version on master to github-pages (gh-pages branch)
  grunt.registerTask("ghPages", ["clean:pages", "npmRelease", "concat:pages", "copy:pages", "gh-pages"]);

  //releases master and gh-pages at the same time (with auto-version bump)
  grunt.registerTask("release", ["clean:pages", "npmRelease", "bump", "concat:pages", "copy:pages", "gh-pages", "run:publish"]);

  grunt.registerTask("default", ["distBase", "watch"]);
};