const process = require("process");

module.exports = {
  options: {
    failOnError: true
  },
  //run typescript compiler directly since all tools don't support latest flags
  tscEs6: {
    options: {
      cwd: process.cwd()
    },
    exec: `bash build-utils/tsc-build.sh`
  },
  npmPublish: {
    options: {
      cwd: process.cwd() + "/build/npm"
    },
    exec: `. ./ENV_VARS && npm publish`
  },
  publishRelease: {
    options: {
      cwd: process.cwd()
    },
    exec: `(export VERSION='<%= package.version %>' && export CHANGELOG='<%= changelog %>' && bash build-utils/release.sh)`
  }
};
