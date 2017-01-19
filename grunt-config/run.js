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
    `.replace(/\n[\t ]+/g,' ').split(' ').filter(x => x != '')
  },
  publish: {
    cmd: 'npm',
    args: ['publish']
  }
};
