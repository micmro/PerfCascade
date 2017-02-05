module.exports = {
  options: {
    files: ['package.json'],
    updateConfigs: ["package"],
    commit: true,
    commitMessage: 'Release v%VERSION%',
    commitFiles: ['package.json', 'CHANGELOG.md'],
    createTag: true,
    tagName: 'v%VERSION%-source',
    tagMessage: 'Source of release v%VERSION%',
    push: true, // to push tag and updated package.json
    pushTo: 'upstream',
    gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
    globalReplace: false,
    prereleaseName: 'dev',
    metadata: '',
    // dryRun: true,
    regExp: false
  }
};
