#!/bin/bash
set -o errexit

echo "Creating release for version: $PACKAGE_VERSION"
echo "Artifact name: ./dist/${3}_${PACKAGE_VERSION}.zip"

LATEST_VERSION=$(curl --silent "https://api.github.com/repos/$1/$2/releases/latest" | 
  grep '"tag_name":' |                                                                
  sed -E 's/.*"([^"]+)".*/\1/')

echo "LATEST_VERSION: ${LATEST_VERSION}"

if [ "${LATEST_VERSION}" != "${PACKAGE_VERSION}" ]; then

$HOME/bin/ghr -t ${ghoauth} -u ${CIRCLE_PROJECT_USERNAME} -r ${CIRCLE_PROJECT_REPONAME} -c ${CIRCLE_SHA1} -delete ${PACKAGE_VERSION} "./dist/${3}_${4}.zip"

else

echo "VERSION: ${PACKAGE_VERSION} already released"

fi