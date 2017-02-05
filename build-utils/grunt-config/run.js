const process = require("process");

module.exports = {
  options: {
    failOnError: true
  },
  //run typescrip compiler directly since all tools don't support latest flags
  tscEs6: {
    cmd: 'npm',
    args: `run tsc -- src/ts/main.ts src/ts/file-reader.ts
    --outDir ./build/npm/lib/
    --module es6
    --target es6
    --rootDir src/ts/
    --declaration true
    --declarationDir ./build/npm/types
    `.replace(/\n[\t ]+/g, ' ').split(' ').filter(x => x != '')
  },
  npmPublish: {
    options: {
      cwd: process.cwd() + "/build/npm"
    },
    cmd: 'npm',
    args: ['publish'],
  },
  publishRelease: {
    options: {
      cwd: process.cwd()
    },
    exec: `(export VERSION='<%= package.version %>' && export CHANGELOG='<%= changelog %>' && bash build-utils/release.sh)`
  }
};
