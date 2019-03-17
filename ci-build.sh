#!/bin/bash
set -ev

npm install --quiet

regexp="^v[0-9]+\.[0-9]+\.[0-9]+$"

if [[ "${TRAVIS_BRANCH}" =~ $regexp ]]; then
    echo "-----> on a version branch"
    if [ "$TRAVIS_OS_NAME" == "linux" ]; then
        echo "-----> build for  linux"
        docker run --rm \
        --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|_TOKEN|_KEY|AWS_|STRIP|BUILD_') \
        -v ${PWD}:/project \
        -v ~/.cache/electron:/root/.cache/electron \
        -v ~/.cache/electron-builder:/root/.cache/electron-builder \
        electronuserland/builder:wine \
        /bin/bash -c "npm install && npm run ship --linux --win"
    else
        echo "-----> build for mac"
        npm run ship
    fi
else
    echo "-----> NOT on a version branch"
    npm run validate
fi
