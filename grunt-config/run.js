module.exports = {
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
};
