#!/usr/bin/env bash
# release.sh
# assumes to run in repo root

# load (private) environment variables like RELEASE_KEY from non-commited file
. ./ENV_VARS

# check vars
: "${VERSION?Need to set VERSION environment variable}"
: "${GITHUB_TOKEN?Need to set GITHUB_TOKEN environment variable}"

echo "Start Github release for ${VERSION}..."

CHANGELOG="${CHANGELOG:-}"

###
# Github Release
###
[ -d .release ] && rm -rf .release
git clone -b release \
  --branch=release \
  --single-branch \
  git@github.com:micmro/PerfCascade.git \
  .release

cd .release
# remove all to ensure deleted files get deleted as well
git rm -rf .

# Copy files
cp -r ../build/release/ .
[ -f .DS_Store ] && rm .DS_Store

echo "Commit and tag 'release' branch..."
git add -A
git commit -m "Release v$VERSION"
git tag "v$VERSION"
#git tag -a "v$VERSION" -m "Release of version 1.0.0"
git push --follow-tags

echo "make Github release"
# make releases
# TODO: make final not draft once confirmed working
# TODO: add Changelog
API_JSON=$(printf '{"tag_name": "v%s", "target_commitish": "release", "name": "v%s", "body": "%s", "draft": false, "prerelease": false}' $VERSION $VERSION $CHANGELOG)
curl \
  --data "$API_JSON" \
  -H "Authorization: token ${GITHUB_TOKEN}" \
  https://api.github.com/repos/micmro/PerfCascade/releases

# echo "Github release done - cleanup..."
# rm -rf .release
