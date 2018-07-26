#!/bin/bash
set -ev

npm install

if [[ "${TRAVIS_BRANCH}" =~ "/^v\d+\.\d+(\.\d+)?(-\S*)?$/" ]]; then
  if [ "$TRAVIS_OS_NAME" == "linux" ]; then
      docker run --rm \
        --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|_TOKEN|_KEY|AWS_|STRIP|BUILD_') \
        -v ${PWD}:/project \
        -v ~/.cache/electron:/root/.cache/electron \
        -v ~/.cache/electron-builder:/root/.cache/electron-builder \
        electronuserland/builder \
        /bin/bash -c "npm install && npm run dist"
    else
      npm run dist
    fi
else
  npm run validate
fi