#!/bin/bash
set -o errexit

join_by () {
  local IFS="$1"; shift; echo "$*";
}

if [ "${GITHUB_REF_NAME}" == "master" ]; then
  # get version from repo
  OLD_VERSION="$(scripts/get-latest-version.sh $1 $2)"
  echo "Latest GitHub release version: ${OLD_VERSION}"

  # split into array
  IFS='.' read -ra ARRAY_VERSION <<< "$OLD_VERSION"

  # bump minor
  ARRAY_VERSION[1]=$((ARRAY_VERSION[1]+1))

  # join into string
  NEW_VERSION=$(join_by . ${ARRAY_VERSION[@]})
elif [[ ! -z "${GITHUB_REF_NAME}" && ! -z "${GITHUB_RUN_NUMBER}" ]]; then
    NEW_VERSION="$(echo ${GITHUB_REF_NAME} | sed -e 's/\//-/g')_${GITHUB_RUN_NUMBER}"
else
    NEW_VERSION="dev"
fi

echo "Bumped version: ${NEW_VERSION}"
echo "${NEW_VERSION}" > BUMPED_VERSION


# Usage
# $ bump-version.sh qlik-oss qsSimpleKPI
