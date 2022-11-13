#!/usr/bin/env bash
# tsc-build.sh
# assumes to run in repo root

set -e #exit on errors

# load (private) environment variables like RELEASE_KEY from non-commited file
. ./ENV_VARS

# check vars
: "${NPM_TOKEN?Need to set NPM_TOKEN environment variable}"

cd ./build/npm

NPM_TOKEN=$NPM_TOKEN npm run tsc -- src/ts/main.ts src/ts/file-reader.ts \
    --noEmit false \
    --outDir ./build/npm/lib/ \
    --module es2020 \
    --target es2020 \
    --rootDir src/ts/ \
    --declaration true \
    --declarationDir ./build/npm/types \