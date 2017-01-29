module.exports = {
  options: {
    files: ['package.json'],
    updateConfigs: ["package"],
    commit: true,
    commitMessage: 'Release v%VERSION%',
    commitFiles: ['package.json'],
    createTag: true,
    tagName: 'v%VERSION%',
    tagMessage: 'Version %VERSION%',
    push: true, // to push tag and updated package.json
    pushTo: 'upstream',
    gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
    // globalReplace: true,
    prereleaseName: 'dev',
    metadata: '',
    // dryRun: true,
    regExp: false
  }
};
