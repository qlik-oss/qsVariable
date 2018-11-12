#!/bin/bash
set -o errexit

echo "Creating release for version: $PACKAGE_VERSION"
echo "Artifact name: ./dist/${3}_${PACKAGE_VERSION}.zip"
$HOME/bin/ghr -t ${ghoauth} -u ${CIRCLE_PROJECT_USERNAME} -r ${CIRCLE_PROJECT_REPONAME} -c ${CIRCLE_SHA1} -delete ${PACKAGE_VERSION} "./dist/${3}_${4}.zip"