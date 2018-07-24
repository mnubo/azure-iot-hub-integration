#!/usr/bin/env bash

set -e

BUILD_IMAGE_NAME=az-function-packager:latest

docker build -t $BUILD_IMAGE_NAME -f Dockerfile $(pwd)
docker run -it --rm -v "$(pwd):/data" $BUILD_IMAGE_NAME
