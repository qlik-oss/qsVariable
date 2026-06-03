#!/bin/bash
set -o errexit

echo "Creating release for version: $4"
echo "Artifact name: ./dist/${3}_${4}.zip"
gh release create "${4}" "./dist/${3}_${4}.zip" --repo "${1}/${2}"


# Usage
# $ create-release.sh qlik-oss qsSimpleKPI qlik-multi-kpi 0.3.1
