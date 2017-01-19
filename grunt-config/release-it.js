// Docs: https://github.com/webpro/release-it#default-settings

/**
 - commit and tag current commit
 - build
 - making a release to npm
 - making a GH release (and tag it) (updating the site with assets from the latest release)
 - making the generated js/css files available for download (not via npm)

 */
module.exports = {
  "options": {
    "non-interactive": true,
    "dry-run": true, //dummy mode
    "verbose": true, //keep it chatty for now
    // "force": false,
    "pkgFiles": ["package.json"],
    "increment": "<%= releaseIncrement %>",
    // "prereleaseId": null,
    "commitMessage": "Release v%s",
    "tagName": "v%s",
    "tagAnnotation": "Release v%s",
    "buildCommand": "grunt releaseBuild",
    // "changelogCommand": "git log --pretty=format:'* %s (%h)' [REV_RANGE]",
    "requireCleanWorkingDir": true,
    "src": {
      "pushRepo": "git@github.com:micmro/PerfCascade.git",
      // "beforeStartCommand": false,
    //   "beforeStageCommand": false,
    //   "afterReleaseCommand": false
    },
    "dist": {
      "repo": "git@github.com:micmro/PerfCascade.git#release",
      "stageDir": ".stage",
      // "baseDir": "dist",
    //   "files": ["**/*"],
    //   "pkgFiles": null,
    //   "beforeStageCommand": false,
      // "afterReleaseCommand": function() {
      // }
    },
    "npm": {
      "publish": true,
      "publishPath": "./npm",
    //   "tag": "latest",
    //   "private": false,
    //   "forcePublishSourceRepo": false
    },
    "github": {
      "release": false,
      "releaseName": "Release %s",
      "tokenRef": "GITHUB_TOKEN"
    }
  }
};
