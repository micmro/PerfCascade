module.exports = {
  options: {
    files: ['package.json'],
    updateConfigs: ["package"],
    commit: false,
    commitMessage: 'Release v%VERSION%',
    commitFiles: ['package.json'],
    createTag: false, // true
    tagName: 'v%VERSION%',
    tagMessage: 'Version %VERSION%',
    push: false, //true // to push tag and updated package.json
    // pushTo: 'upstream',
    gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
    // globalReplace: true,
    prereleaseName: false,
    metadata: '',
    // dryRun: true, //false
    regExp: false
  }
};
